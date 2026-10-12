import { db, type Lead, type LeadStatus, type User, type UserTier } from "./db";
import { mailer } from "./mailer";

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only handle /api/ routes
  if (!pathname.startsWith("/api/")) {
    return null;
  }

  const method = request.method.toUpperCase();

  // JSON helper
  const json = (data: unknown, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  };

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // -------------------------------------------------------------
    // SYSTEM HEALTH & TELEMETRY ENDPOINTS
    // -------------------------------------------------------------

    // GET /api/health
    if (pathname === "/api/health" && method === "GET") {
      const dbStatus = await db.getDatabaseStatus();
      return json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: dbStatus,
        service: "VESPER Production API",
        version: "1.0.0-release",
        uptimeSeconds: Math.round(process.uptime()),
      });
    }

    // GET /api/app/version or /api/updates
    if ((pathname === "/api/app/version" || pathname === "/api/updates") && method === "GET") {
      const config = await db.getAppVersionConfig();
      return json(config);
    }

    // POST /api/admin/version
    if (pathname === "/api/admin/version" && method === "POST") {
      const body = await parseBody<{
        latestVersion?: string;
        minRequiredVersion?: string;
        mandatory?: boolean;
        downloadUrl?: string;
        directExeUrl?: string;
        webPortalUrl?: string;
        releaseNotes?: string;
      }>();
      const updated = await db.setAppVersionConfig(body);
      return json({ success: true, config: updated });
    }

    // Helper to safely parse JSON body
    const parseBody = async <T = Record<string, unknown>>(): Promise<T> => {
      try {
        const text = await request.text();
        return text ? (JSON.parse(text) as T) : ({} as T);
      } catch {
        return {} as T;
      }
    };

    // POST /api/feedback
    if (pathname === "/api/feedback" && method === "POST") {
      const body = await parseBody<{
        name?: string;
        email?: string;
        rating?: number;
        message?: string;
        category?: "feature" | "bug" | "latency" | "general";
        source?: string;
      }>();

      if (!body.message || !body.message.trim()) {
        return json({ error: "Feedback message cannot be empty." }, 400);
      }

      const feedback = await db.submitFeedback({
        message: body.message,
        ...(body.name ? { name: body.name } : {}),
        ...(body.email ? { email: body.email } : {}),
        ...(typeof body.rating === "number" ? { rating: body.rating } : {}),
        ...(body.category ? { category: body.category } : {}),
        ...(body.source ? { source: body.source } : {}),
      });

      return json({ success: true, feedback }, 201);
    }

    // POST /api/telemetry
    if (pathname === "/api/telemetry" && method === "POST") {
      const body = await parseBody<{
        eventType?: "dictation_sim" | "smart_qa" | "mic_test" | "download_click" | "page_view";
        metadata?: Record<string, unknown>;
      }>();

      if (body.eventType) {
        await db.recordTelemetry({
          eventType: body.eventType,
          ...(body.metadata ? { metadata: body.metadata } : {}),
        });
      }

      return json({ received: true });
    }

    // -------------------------------------------------------------
    // AUTH ENDPOINTS
    // -------------------------------------------------------------

    // POST /api/auth/login
    if (pathname === "/api/auth/login" && method === "POST") {
      const body = await parseBody<{ email?: string; password?: string }>();
      const { email, password } = body;

      if (!email || !password) {
        return json({ error: "Email and password are required." }, 400);
      }

      const user = await db.findUserByEmail(email);
      if (!user || user.passwordHash !== password) {
        return json({ error: "Invalid email or password." }, 401);
      }

      const token = `vesper-token-${user.id}-${Date.now()}`;
      return json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          provider: user.provider,
          isVerified: user.isVerified ?? false,
          tier: user.tier ?? "free",
          licenseKey: user.licenseKey,
          licenseActive: user.licenseActive ?? false,
          usageQuota: user.usageQuota,
        },
      });
    }

    // POST /api/auth/signup
    if (pathname === "/api/auth/signup" && method === "POST") {
      const body = await parseBody();
      const { email, password, name } = body as {
        email?: string;
        password?: string;
        name?: string;
      };

      if (!email || !password) {
        return json({ error: "Email and password are required." }, 400);
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = await db.findUserByEmail(cleanEmail);
      if (existing) {
        return json({ error: "An account with this email already exists." }, 409);
      }

      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const licenseKey = db.generateLicenseKey();
      const cleanName: string = (name && name.trim()) || cleanEmail.split("@")[0] || "User";

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        role: "user",
        provider: "local",
        passwordHash: password,
        isVerified: true, // Instant activation - no email verification needed
        verificationPin: pin,
        verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 3600000).toISOString(),
        tier: "pro", // Instant Pro evaluation access
        licenseKey,
        licenseActive: true,
        usageQuota: {
          totalSeconds: 72000,
          usedSeconds: 0,
          periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        tokenQuota: {
          monthlyAllowance: 5000000,
          usedTokens: 0,
          promptTokens: 0,
          completionTokens: 0,
          periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      await db.createUser(newUser);
      const token = `vesper-token-${newUser.id}-${Date.now()}`;

      // Dispatch welcome thank-you email with license key & feedback channel
      mailer.sendWelcomeEmail(newUser.email, cleanName, licenseKey, newUser.tier, url.origin).catch((err) => {
        console.warn("[VESPER Signup] Welcome email dispatch warning:", err);
      });

      return json({
        token,
        message: "Welcome to VESPER! Your account and software license are active. A welcome email with your license key has been dispatched.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          provider: newUser.provider,
          isVerified: newUser.isVerified,
          tier: newUser.tier,
          licenseKey: newUser.licenseKey,
          licenseActive: newUser.licenseActive,
          usageQuota: newUser.usageQuota,
          tokenQuota: newUser.tokenQuota,
        },
      });
    }

    // POST /api/auth/google
    if (pathname === "/api/auth/google" && method === "POST") {
      return json(
        {
          success: false,
          error: "Google Sign-In is currently in progress. Please use email authentication — we are working on that.",
        },
        400,
      );
    }

    // POST /api/auth/send-verification
    if (pathname === "/api/auth/send-verification" && method === "POST") {
      const body = await parseBody<{ email?: string }>();
      const email = body.email?.trim().toLowerCase();

      if (!email) {
        return json({ error: "Email is required." }, 400);
      }

      let user = await db.findUserByEmail(email);
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const licenseKey = user?.licenseKey || db.generateLicenseKey();

      const fallbackName: string = email.split("@")[0] || "User";

      if (!user) {
        const newUser: User = {
          id: `usr-${Date.now()}`,
          name: fallbackName,
          email,
          role: "user",
          provider: "local",
          isVerified: false,
          verificationPin: pin,
          verificationToken,
          verificationTokenExpiry: new Date(Date.now() + 3600000).toISOString(),
          tier: "free",
          licenseKey,
          licenseActive: false,
          usageQuota: {
            totalSeconds: 3600,
            usedSeconds: 0,
            periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
          },
          createdAt: new Date().toISOString(),
        };
        await db.createUser(newUser);
        user = newUser;
      } else {
        await db.updateUser(user.id, {
          verificationPin: pin,
          verificationToken,
          verificationTokenExpiry: new Date(Date.now() + 3600000).toISOString(),
          licenseKey,
        });
      }

      const userName: string = user.name || fallbackName;
      const mailRes = await mailer.sendVerificationEmail(
        email,
        userName,
        verificationToken,
        pin,
        licenseKey,
        url.origin,
      );

      return json({
        success: true,
        message: `Verification PIN dispatched to ${email}.`,
        pin,
        simulatedPin: pin, // Available for development inspection
        messageId: mailRes.messageId,
      });
    }

    // POST /api/auth/verify-email
    if (pathname === "/api/auth/verify-email" && method === "POST") {
      const body = await parseBody<{ email?: string; code?: string; token?: string; pin?: string }>();
      const email = body.email?.trim().toLowerCase();
      const code = body.code || body.pin || body.token;

      if (!email || !code) {
        return json({ error: "Email and verification code/token are required." }, 400);
      }

      const result = await db.verifyUserEmail(email, code);
      if (!result.success || !result.user) {
        return json({ error: result.error || "Verification failed." }, 400);
      }

      return json({
        success: true,
        verified: true,
        message: "Email verified successfully! Software subscription license activated.",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isVerified: result.user.isVerified,
          tier: result.user.tier,
          licenseKey: result.user.licenseKey,
          licenseActive: result.user.licenseActive,
        },
        licenseKey: result.user.licenseKey,
        tier: result.user.tier,
      });
    }

    // GET /api/auth/verify-email (Direct email link click)
    if (pathname === "/api/auth/verify-email" && method === "GET") {
      const email = url.searchParams.get("email") || "";
      const token = url.searchParams.get("token") || "";

      if (email && token) {
        const result = await db.verifyUserEmail(email, token);
        if (result.success) {
          // Redirect to Guidance / Welcome page with verification parameter
          return Response.redirect(`${url.origin}/guidance?verified=true&license=${result.user?.licenseKey || ""}`, 302);
        }
      }

      return json({ error: "Invalid or expired email verification link." }, 400);
    }

    // POST /api/license/verify (Desktop App & Simulator License Gate)
    if (pathname === "/api/license/verify" && method === "POST") {
      const body = await parseBody<{ licenseKey?: string; machineId?: string; machineName?: string }>();
      const licenseKey = body.licenseKey?.trim().toUpperCase();

      if (!licenseKey) {
        return json({ valid: false, error: "License key is required." }, 400);
      }

      const user = await db.findUserByLicenseKey(licenseKey);
      if (!user) {
        return json({
          valid: false,
          error: "License key not recognized. Register at vesper.com to generate your key.",
        }, 404);
      }

      if (!user.isVerified) {
        return json({
          valid: false,
          error: "Account unverified. Please verify your email to unlock desktop app usage.",
          requiresEmailVerification: true,
          email: user.email,
        }, 403);
      }

      if (!user.licenseActive) {
        return json({
          valid: false,
          error: "License key has been paused or expired. Upgrade your plan at vesper.com.",
        }, 403);
      }

      // Record hardware machine binding
      if (body.machineId) {
        const boundDevices = Array.isArray(user.boundDevices) ? [...user.boundDevices] : [];
        const existingIdx = boundDevices.findIndex((d) => d.machineId === body.machineId);
        if (existingIdx >= 0) {
          boundDevices[existingIdx].activatedAt = new Date().toISOString();
          if (body.machineName) boundDevices[existingIdx].machineName = body.machineName;
        } else {
          boundDevices.push({
            machineId: body.machineId,
            machineName: body.machineName || "Windows Workstation",
            activatedAt: new Date().toISOString(),
          });
        }
        await db.updateUser(user.id, { boundDevices });
      }

      return json({
        valid: true,
        licenseKey: user.licenseKey,
        tier: user.tier,
        status: "active",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        quota: {
          totalSeconds: user.usageQuota?.totalSeconds ?? 36000,
          usedSeconds: user.usageQuota?.usedSeconds ?? 0,
          remainingSeconds: Math.max(0, (user.usageQuota?.totalSeconds ?? 36000) - (user.usageQuota?.usedSeconds ?? 0)),
          remainingMinutes: Math.round(Math.max(0, (user.usageQuota?.totalSeconds ?? 36000) - (user.usageQuota?.usedSeconds ?? 0)) / 60),
          periodReset: user.usageQuota?.periodReset || new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        tokenQuota: {
          monthlyAllowance: user.tokenQuota?.monthlyAllowance ?? (user.tier === "enterprise" ? 10000000 : user.tier === "pro" ? 5000000 : 500000),
          usedTokens: user.tokenQuota?.usedTokens ?? 0,
          remainingTokens: Math.max(0, (user.tokenQuota?.monthlyAllowance ?? 500000) - (user.tokenQuota?.usedTokens ?? 0)),
          periodReset: user.tokenQuota?.periodReset || new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        engineConfig: {
          neuralPipeline: "vesper-ultra-latency",
          hardwareAcceleration: "DirectML / CUDA / NPU",
          localFallback: true,
          latencyTargetMs: 140,
        },
      });
    }

    // GET /api/download/windows (Binary Distribution & Telemetry)
    if (pathname === "/api/download/windows" && (method === "GET" || method === "HEAD")) {
      const fs = await import("node:fs");
      const path = await import("node:path");

      const publicExe = path.resolve(process.cwd(), "public/downloads/VESPER-Setup-1.0.0.exe");
      const prodDistExe = path.resolve(process.cwd(), "../Production/dist/VESPER-Setup-1.0.0.exe");

      const exePath = fs.existsSync(publicExe) ? publicExe : (fs.existsSync(prodDistExe) ? prodDistExe : null);

      if (exePath) {
        const stats = fs.statSync(exePath);
        if (method === "HEAD") {
          return new Response(null, {
            headers: {
              "Content-Type": "application/vnd.microsoft.portable-executable",
              "Content-Disposition": 'attachment; filename="VESPER-Setup-1.0.0.exe"',
              "Content-Length": stats.size.toString(),
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
        const stream = fs.createReadStream(exePath);
        let isClosed = false;
        const readableStream = new ReadableStream({
          start(controller) {
            stream.on("data", (chunk) => {
              if (!isClosed) {
                try {
                  controller.enqueue(chunk);
                } catch {
                  isClosed = true;
                  stream.destroy();
                }
              }
            });
            stream.on("end", () => {
              if (!isClosed) {
                isClosed = true;
                controller.close();
              }
            });
            stream.on("error", (err) => {
              if (!isClosed) {
                isClosed = true;
                controller.error(err);
              }
            });
          },
          cancel() {
            isClosed = true;
            stream.destroy();
          },
        });

        return new Response(readableStream, {
          headers: {
            "Content-Type": "application/vnd.microsoft.portable-executable",
            "Content-Disposition": 'attachment; filename="VESPER-Setup-1.0.0.exe"',
            "Content-Length": stats.size.toString(),
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // When running in serverless (e.g. Vercel) where 144MB binary is hosted on GitHub Releases
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "https://github.com/Narayaaana11/vesper-release/releases/download/v1.0.0/VESPER-Setup-1.0.0.exe",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // GET /api/geo (Free IP Geolocation & Localization via free-for.dev freeipapi.com)
    if (pathname === "/api/geo" && method === "GET") {
      const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                       request.headers.get("cf-connecting-ip") || 
                       "";
      try {
        if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
          const geoRes = await fetch(`https://freeipapi.com/api/json/${clientIp}`, { signal: AbortSignal.timeout(3000) });
          if (geoRes.ok) {
            const data = await geoRes.json();
            return json({
              ip: data.ipAddress || clientIp,
              countryCode: data.countryCode || "US",
              countryName: data.countryName || "United States",
              cityName: data.cityName || "Unknown",
              currency: data.currency?.code || "USD",
              timeZone: data.timeZone || "UTC",
              provider: "freeipapi.com (free-for.dev)",
            });
          }
        }
      } catch {
        // Graceful fallback on network timeout
      }

      return json({
        ip: "127.0.0.1",
        countryCode: "US",
        countryName: "United States",
        cityName: "Local Workstation",
        currency: "USD",
        timeZone: "UTC",
        provider: "local-fallback",
      });
    }

    // GET /api/auth/me
    if (pathname === "/api/auth/me" && method === "GET") {
      const authHeader = request.headers.get("Authorization") || "";
      const match = authHeader.match(/Bearer vesper-token-(usr-[^ -]+)/);

      if (!match || !match[1]) {
        return json({ error: "Unauthorized. Missing or invalid Bearer token." }, 401);
      }

      const userId: string = match[1];
      const user = await db.findUserById(userId);
      if (!user) {
        return json({ error: "User session expired or not found." }, 401);
      }

      return json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          provider: user.provider,
        },
      });
    }

    // -------------------------------------------------------------
    // CRM ENDPOINTS (Backed by MongoDB)
    // -------------------------------------------------------------

    // GET /api/crm/stats
    if (pathname === "/api/crm/stats" && method === "GET") {
      const stats = await db.getCrmStats();
      return json(stats);
    }

    // GET /api/crm/leads
    if (pathname === "/api/crm/leads" && method === "GET") {
      const q = url.searchParams.get("q")?.toLowerCase() || "";
      const statusFilter = url.searchParams.get("status") || "";

      let leads = await db.getAllLeads();

      if (statusFilter && statusFilter !== "All") {
        leads = leads.filter((l) => l.status === statusFilter);
      }

      if (q) {
        leads = leads.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            (l.company && l.company.toLowerCase().includes(q)) ||
            (l.hardware && l.hardware.toLowerCase().includes(q)) ||
            l.useCase.toLowerCase().includes(q),
        );
      }

      return json({ leads, count: leads.length });
    }

    // POST /api/crm/leads
    if (pathname === "/api/crm/leads" && method === "POST") {
      const body = await parseBody();
      const leadInput = body as {
        name: string;
        email: string;
        company?: string;
        useCase?: string;
        platforms?: string[];
        hardware?: string;
        dealValue?: number;
        status?: LeadStatus;
        notes?: string;
      };

      if (!leadInput.name || !leadInput.email) {
        return json({ error: "Lead name and email are required." }, 400);
      }

      const newLead = await db.createLead({
        name: leadInput.name.trim(),
        email: leadInput.email.trim(),
        company: leadInput.company?.trim() || "",
        useCase: leadInput.useCase || "Developer / Engineer",
        platforms: leadInput.platforms || ["Windows Power User"],
        hardware: leadInput.hardware || "NVIDIA RTX / Intel NPU",
        status: leadInput.status || "New Lead",
        dealValue: leadInput.dealValue || 120,
        notes: leadInput.notes || "Lead generated via VESPER launchpad portal.",
      });

      return json({ lead: newLead }, 201);
    }

    // PATCH /api/crm/leads/:id
    if (pathname.startsWith("/api/crm/leads/") && method === "PATCH") {
      const leadId = pathname.replace("/api/crm/leads/", "");
      const body = await parseBody();
      const updates = body as Partial<Lead>;

      const updated = await db.updateLead(leadId, updates);
      if (!updated) {
        return json({ error: "Lead not found." }, 404);
      }

      return json({ lead: updated });
    }

    // DELETE /api/crm/leads/:id
    if (pathname.startsWith("/api/crm/leads/") && method === "DELETE") {
      const leadId = pathname.replace("/api/crm/leads/", "");
      const deleted = await db.deleteLead(leadId);
      if (!deleted) {
        return json({ error: "Lead not found." }, 404);
      }
      return json({ success: true, message: "Lead removed from CRM database." });
    }

    // -------------------------------------------------------------
    // ADMIN USERS & LICENSE MANAGEMENT ENDPOINTS
    // -------------------------------------------------------------

    // GET /api/admin/metrics (High-level real-time fleet, tokens, and revenue telemetry)
    if (pathname === "/api/admin/metrics" && method === "GET") {
      const users = await db.getAllUsers();
      const leads = await db.getAllLeads();
      const crmStats = await db.getCrmStats();

      const totalUsers = users.length;
      const activeWorkstations = users.filter((u) => u.licenseActive).length;
      const verifiedUsers = users.filter((u) => u.isVerified).length;
      const payingCustomers = users.filter((u) => u.tier === "pro" || u.tier === "enterprise").length;
      const totalTokensBurned = users.reduce((acc, u) => acc + (u.tokenQuota?.usedTokens || 0), 0);
      const totalPromptTokens = users.reduce((acc, u) => acc + (u.tokenQuota?.promptTokens || 0), 0);
      const totalCompletionTokens = users.reduce((acc, u) => acc + (u.tokenQuota?.completionTokens || 0), 0);

      return json({
        success: true,
        metrics: {
          totalUsers,
          activeWorkstations,
          verifiedUsers,
          payingCustomers,
          totalTokensBurned,
          totalPromptTokens,
          totalCompletionTokens,
          pipelineValue: crmStats.totalPipelineValue || crmStats.pipelineValue || 0,
          totalLeads: leads.length,
          proTrials: crmStats.activeTrials || crmStats.proTrials || 0,
        },
      });
    }

    // GET /api/admin/users
    if (pathname === "/api/admin/users" && method === "GET") {
      const users = await db.getAllUsers();
      return json({
        success: true,
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar,
          provider: u.provider,
          isVerified: u.isVerified ?? false,
          tier: u.tier ?? "free",
          licenseKey: u.licenseKey,
          licenseActive: u.licenseActive ?? false,
          usageQuota: u.usageQuota,
          tokenQuota: u.tokenQuota,
          createdAt: u.createdAt,
        })),
      });
    }

    // PATCH /api/admin/users/:id
    if (pathname.startsWith("/api/admin/users/") && method === "PATCH") {
      const userId = pathname.replace("/api/admin/users/", "");
      const body = await parseBody<{
        tier?: UserTier;
        isVerified?: boolean;
        licenseActive?: boolean;
        regenerateLicense?: boolean;
      }>();

      const updates: Partial<User> = {};
      if (body.tier !== undefined) updates.tier = body.tier;
      if (body.isVerified !== undefined) updates.isVerified = body.isVerified;
      if (body.licenseActive !== undefined) updates.licenseActive = body.licenseActive;
      if (body.regenerateLicense) {
        updates.licenseKey = db.generateLicenseKey();
      }

      const updated = await db.updateUser(userId, updates);
      if (!updated) {
        return json({ error: "User not found." }, 404);
      }

      return json({ success: true, user: updated });
    }

    // POST /api/admin/invite
    if (pathname === "/api/admin/invite" && method === "POST") {
      const body = await parseBody<{
        email?: string;
        name?: string;
        tier?: UserTier;
      }>();

      const email = body.email?.trim().toLowerCase();
      const name = body.name?.trim() || "Developer";
      const tier: UserTier = body.tier || "pro";

      if (!email) {
        return json({ error: "Email is required." }, 400);
      }

      let user = await db.findUserByEmail(email);
      const licenseKey = user?.licenseKey || db.generateLicenseKey();

      if (!user) {
        user = {
          id: `usr-${Date.now()}`,
          name,
          email,
          role: "user",
          provider: "local",
          isVerified: true,
          tier,
          licenseKey,
          licenseActive: true,
          usageQuota: {
            totalSeconds: tier === "enterprise" ? 360000 : 72000,
            usedSeconds: 0,
            periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
          },
          createdAt: new Date().toISOString(),
        };
        await db.createUser(user);
      } else {
        await db.updateUser(user.id, {
          isVerified: true,
          licenseActive: true,
          tier,
        });
      }

      const mailRes = await mailer.sendInviteEmail(email, name, tier, licenseKey, url.origin);
      return json({
        success: true,
        message: `Invitation with ${tier.toUpperCase()} license sent to ${email}.`,
        licenseKey,
        messageId: mailRes.messageId,
      });
    }

    // -------------------------------------------------------------
    // AUTONOMOUS E2E VALIDATION AGENT TRIGGER
    // -------------------------------------------------------------

    // POST /api/admin/agent-audit
    if (pathname === "/api/admin/agent-audit" && method === "POST") {
      const { execFile } = await import("node:child_process");
      const path = await import("node:path");
      const fs = await import("node:fs");

      const scriptPath = path.resolve(process.cwd(), "scripts/vesper-validator-agent.mjs");
      const origin = url.origin || "http://localhost:8080";

      return new Promise<Response>((resolve) => {
        execFile("node", [scriptPath, origin], { timeout: 30000 }, (error, stdout, stderr) => {
          const reportPath = path.resolve(process.cwd(), "reports/e2e-audit-report.json");
          let reportData: unknown = null;
          try {
            if (fs.existsSync(reportPath)) {
              reportData = JSON.parse(fs.readFileSync(reportPath, "utf8"));
            }
          } catch {
            // ignore
          }

          resolve(
            json({
              success: !error,
              exitCode: error ? error.code : 0,
              stdout,
              stderr,
              report: reportData,
            })
          );
        });
      });
    }

    // GET /api/admin/agent-audit
    if (pathname === "/api/admin/agent-audit" && method === "GET") {
      const path = await import("node:path");
      const fs = await import("node:fs");
      const reportPath = path.resolve(process.cwd(), "reports/e2e-audit-report.json");
      if (fs.existsSync(reportPath)) {
        const reportData = JSON.parse(fs.readFileSync(reportPath, "utf8"));
        return json({ success: true, report: reportData });
      }
      return json({ success: false, message: "No report generated yet." }, 404);
    }

    // -------------------------------------------------------------
    // TOKEN TELEMETRY & STRIPE AUTOMATED WEBHOOK GATEWAY
    // -------------------------------------------------------------

    // POST /api/telemetry/tokens
    if (pathname === "/api/telemetry/tokens" && method === "POST") {
      const body = await parseBody<{
        userId?: string;
        licenseKey?: string;
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
        model?: string;
      }>();

      let targetUser: User | undefined;
      if (body.userId) {
        targetUser = await db.findUserById(body.userId);
      } else if (body.licenseKey) {
        targetUser = await db.findUserByLicenseKey(body.licenseKey);
      } else {
        // Fallback to active admin or first user if testing without auth
        const all = await db.getAllUsers();
        targetUser = all[0];
      }

      if (!targetUser) {
        return json({ error: "User or valid license key required to record token telemetry." }, 404);
      }

      const pTokens = body.promptTokens || 0;
      const cTokens = body.completionTokens || 0;
      const tTokens = body.totalTokens || (pTokens + cTokens);

      const updated = await db.recordUserTokens(targetUser.id, {
        promptTokens: pTokens,
        completionTokens: cTokens,
        totalTokens: tTokens,
      });

      return json({
        success: true,
        recorded: tTokens,
        tokenQuota: updated?.tokenQuota,
      });
    }

    // POST /api/stripe/webhook
    if (pathname === "/api/stripe/webhook" && method === "POST") {
      const body = await parseBody<{
        type?: string;
        data?: {
          object?: {
            customer_email?: string;
            client_reference_id?: string;
            amount_total?: number;
            payment_status?: string;
          };
        };
      }>();

      const eventType = body?.type || "checkout.session.completed";
      const session = body?.data?.object;
      const email = session?.customer_email || session?.client_reference_id;

      if (eventType === "checkout.session.completed" && email) {
        const user = await db.findUserByEmail(email);
        if (user) {
          const updated = await db.updateUser(user.id, {
            tier: "pro",
            licenseActive: true,
            usageQuota: {
              totalSeconds: 72000,
              usedSeconds: user.usageQuota?.usedSeconds || 0,
              periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
            },
            tokenQuota: {
              monthlyAllowance: 5000000,
              usedTokens: user.tokenQuota?.usedTokens || 0,
              promptTokens: user.tokenQuota?.promptTokens || 0,
              completionTokens: user.tokenQuota?.completionTokens || 0,
              periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
            },
          });

          // Dispatch confirmation email
          mailer.sendWelcomeEmail(user.email, user.name, user.licenseKey, "pro", url.origin).catch(() => {});

          return json({ success: true, upgraded: true, user: updated?.id });
        }
      }

      return json({ received: true });
    }

    // 404 for unknown /api/ route
    return json({ error: `Endpoint ${method} ${pathname} not found.` }, 404);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("API error:", errorMsg);
    return json({ error: "Internal Server Error", details: errorMsg }, 500);
  }
}
