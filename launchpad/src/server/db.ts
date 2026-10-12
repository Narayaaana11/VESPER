import { getMongoCollection, pingMongo, getMongoStatus } from "./mongodb";

export type UserTier = "free" | "pro" | "enterprise";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | undefined;
  role: "admin" | "user";
  provider: "local" | "google";
  passwordHash?: string | undefined;
  isVerified: boolean;
  verificationToken?: string | undefined;
  verificationPin?: string | undefined;
  verificationTokenExpiry?: string | undefined;
  tier: UserTier;
  licenseKey: string;
  licenseActive: boolean;
  usageQuota: {
    totalSeconds: number;
    usedSeconds: number;
    periodReset: string;
  };
  tokenQuota?: {
    monthlyAllowance: number;
    usedTokens: number;
    promptTokens: number;
    completionTokens: number;
    periodReset: string;
  };
  boundDevices?: Array<{
    machineId: string;
    machineName?: string;
    activatedAt: string;
  }>;
  createdAt: string;
  [key: string]: unknown;
}

export type LeadStatus =
  "New Lead" | "Contacted" | "Qualified" | "Pro Trial" | "Closed Won" | "Enterprise Pilot" | "Lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string | undefined;
  useCase: string;
  platforms: string[];
  hardware?: string | undefined;
  status: LeadStatus;
  dealValue: number; // in USD
  notes: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CrmStats {
  totalLeads: number;
  totalPipelineValue: number;
  pipelineValue?: number | undefined;
  activeTrials: number;
  proTrials?: number | undefined;
  qualifiedLeads?: number | undefined;
  conversionRate: number;
  leadsByStatus: Record<LeadStatus, number>;
}

export interface UserFeedback {
  id: string;
  name?: string | undefined;
  email?: string | undefined;
  category: "feature" | "bug" | "latency" | "general";
  rating: number; // 1-5
  message: string;
  source: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface TelemetryEvent {
  id: string;
  eventType: "dictation_sim" | "smart_qa" | "mic_test" | "download_click" | "page_view";
  metadata?: Record<string, unknown> | undefined;
  timestamp: string;
  [key: string]: unknown;
}

class Database {
  private inMemoryUsers: Map<string, User> = new Map();
  private inMemoryLeads: Map<string, Lead> = new Map();
  private initialized = false;
  private initializingPromise: Promise<void> | null = null;

  constructor() {
    this.seedFallbackData();
  }

  private seedFallbackData() {
    // System Administrator Root Account
    const adminEmail = (process.env["ADMIN_EMAIL"] || "narayana@vesper.com").toLowerCase().trim();
    const adminPassword = process.env["ADMIN_PASSWORD"] || "Narayana@11";
    const adminUser: User = {
      id: "usr-admin-narayana",
      name: "Narayana",
      email: adminEmail,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NarayanaAdmin",
      role: "admin",
      provider: "local",
      passwordHash: adminPassword,
      isVerified: true,
      tier: "enterprise",
      licenseKey: "VESPER-ADMN-2026-ROOT",
      licenseActive: true,
      usageQuota: {
        totalSeconds: 360000,
        usedSeconds: 0,
        periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
      tokenQuota: {
        monthlyAllowance: 10000000,
        usedTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
      createdAt: new Date().toISOString(),
    };
    this.inMemoryUsers.set(adminUser.id, adminUser);
    this.inMemoryLeads.clear();
  }

  public async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    if (this.initializingPromise) return this.initializingPromise;

    this.initializingPromise = (async () => {
      try {
        const usersCol = await getMongoCollection<User>("users");
        const leadsCol = await getMongoCollection<Lead>("leads");

        if (usersCol && leadsCol) {
          // Check if users collection needs initial seeding
          const userCount = await usersCol.countDocuments();
          if (userCount === 0) {
            const seedUsers = Array.from(this.inMemoryUsers.values());
            await usersCol.insertMany(seedUsers);
            console.log(
              `[MongoDB] Seeded root admin user into Atlas collection 'users'.`,
            );
          } else {
            const users = await usersCol.find({}).toArray();
            this.inMemoryUsers.clear();
            users.forEach((u) => this.inMemoryUsers.set(u.id, u));
          }

          // Sync real leads from database (no dummy seeding)
          const leads = await leadsCol.find({}).toArray();
          this.inMemoryLeads.clear();
          leads.forEach((l) => this.inMemoryLeads.set(l.id, l));
        }
      } catch (err) {
        console.warn("[MongoDB] Initialization failed, continuing with in-memory cache:", err);
      } finally {
        this.initialized = true;
      }
    })();

    return this.initializingPromise;
  }

  // ---------------------------------------------------------------------------
  // User Operations
  // ---------------------------------------------------------------------------
  public async findUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        const found = await usersCol.findOne({ email: cleanEmail });
        if (found) {
          this.inMemoryUsers.set(found.id, found);
          return found;
        }
      }
    } catch {
      // Degrade to memory
    }

    for (const u of this.inMemoryUsers.values()) {
      if (u.email.toLowerCase() === cleanEmail) return u;
    }
    return undefined;
  }

  public async findUserById(id: string): Promise<User | undefined> {
    await this.ensureInitialized();

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        const found = await usersCol.findOne({ id });
        if (found) {
          this.inMemoryUsers.set(found.id, found);
          return found;
        }
      }
    } catch {
      // Degrade to memory
    }

    return this.inMemoryUsers.get(id);
  }

  public async findUserByLicenseKey(licenseKey: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const cleanKey = licenseKey.trim().toUpperCase();

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        const found = await usersCol.findOne({ licenseKey: cleanKey });
        if (found) {
          this.inMemoryUsers.set(found.id, found);
          return found;
        }
      }
    } catch {
      // Degrade to memory
    }

    for (const u of this.inMemoryUsers.values()) {
      if (u.licenseKey && u.licenseKey.toUpperCase() === cleanKey) return u;
    }
    return undefined;
  }

  public async createUser(user: User): Promise<User> {
    await this.ensureInitialized();
    this.inMemoryUsers.set(user.id, user);

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        await usersCol.insertOne({ ...user });
      }
    } catch (err) {
      console.warn("[MongoDB] createUser failed to write to Atlas, cached locally:", err);
    }

    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    await this.ensureInitialized();

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        const docs = await usersCol.find({}).sort({ createdAt: -1 }).toArray();
        if (docs.length > 0) {
          this.inMemoryUsers.clear();
          docs.forEach((u) => this.inMemoryUsers.set(u.id, u));
          return docs;
        }
      }
    } catch {
      // Fallback
    }

    return Array.from(this.inMemoryUsers.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.ensureInitialized();
    const current = await this.findUserById(id);
    if (!current) return undefined;

    const updated: User = {
      ...current,
      ...updates,
    };
    this.inMemoryUsers.set(id, updated);

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        await usersCol.updateOne({ id }, { $set: { ...updates } });
      }
    } catch (err) {
      console.warn("[MongoDB] updateUser Atlas write failed:", err);
    }

    return updated;
  }

  public async recordUserTokens(
    userId: string,
    tokens: { promptTokens: number; completionTokens: number; totalTokens: number }
  ): Promise<User | undefined> {
    const user = await this.findUserById(userId);
    if (!user) return undefined;

    const currentQuota = user.tokenQuota || {
      monthlyAllowance: user.tier === "enterprise" ? 10000000 : user.tier === "pro" ? 5000000 : 500000,
      usedTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      periodReset: new Date(Date.now() + 30 * 86400000).toISOString(),
    };

    const updatedQuota = {
      ...currentQuota,
      usedTokens: currentQuota.usedTokens + (tokens.totalTokens || (tokens.promptTokens + tokens.completionTokens)),
      promptTokens: currentQuota.promptTokens + (tokens.promptTokens || 0),
      completionTokens: currentQuota.completionTokens + (tokens.completionTokens || 0),
    };

    return await this.updateUser(userId, { tokenQuota: updatedQuota });
  }

  public async findUserByLicenseKey(licenseKey: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const cleanKey = licenseKey.trim().toUpperCase();

    try {
      const usersCol = await getMongoCollection<User>("users");
      if (usersCol) {
        const found = await usersCol.findOne({ licenseKey: cleanKey });
        if (found) {
          this.inMemoryUsers.set(found.id, found);
          return found;
        }
      }
    } catch {
      // Fallback
    }

    for (const u of this.inMemoryUsers.values()) {
      if (u.licenseKey.toUpperCase() === cleanKey) return u;
    }
    return undefined;
  }

  public async verifyUserEmail(
    email: string,
    tokenOrPin: string,
  ): Promise<{ success: boolean; user?: User | undefined; error?: string | undefined }> {
    await this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();
    const cleanInput = tokenOrPin.trim();

    const user = await this.findUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, error: "No account registered with this email address." };
    }

    if (user.isVerified) {
      return { success: true, user };
    }

    const matchesToken = user.verificationToken && user.verificationToken === cleanInput;
    const matchesPin = user.verificationPin && user.verificationPin === cleanInput;

    if (!matchesToken && !matchesPin) {
      return { success: false, error: "Invalid verification PIN or security token." };
    }

    if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < new Date()) {
      return { success: false, error: "Verification token has expired. Request a new code." };
    }

    const updated = await this.updateUser(user.id, {
      isVerified: true,
      licenseActive: true,
      verificationToken: undefined,
      verificationPin: undefined,
      verificationTokenExpiry: undefined,
    });

    return { success: true, user: updated ?? user };
  }

  public generateLicenseKey(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const segment = () =>
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `VESPER-${segment()}-${segment()}-${segment()}`;
  }

  // ---------------------------------------------------------------------------
  // Lead Operations
  // ---------------------------------------------------------------------------
  public async getAllLeads(): Promise<Lead[]> {
    await this.ensureInitialized();

    try {
      const leadsCol = await getMongoCollection<Lead>("leads");
      if (leadsCol) {
        const docs = await leadsCol.find({}).sort({ createdAt: -1 }).toArray();
        if (docs.length > 0) {
          this.inMemoryLeads.clear();
          docs.forEach((d) => this.inMemoryLeads.set(d.id, d));
          return docs;
        }
      }
    } catch {
      // Fallback
    }

    return Array.from(this.inMemoryLeads.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  public async findLeadById(id: string): Promise<Lead | undefined> {
    await this.ensureInitialized();

    try {
      const leadsCol = await getMongoCollection<Lead>("leads");
      if (leadsCol) {
        const found = await leadsCol.findOne({ id });
        if (found) {
          this.inMemoryLeads.set(found.id, found);
          return found;
        }
      }
    } catch {
      // Fallback
    }

    return this.inMemoryLeads.get(id);
  }

  public async createLead(
    leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "position">,
  ): Promise<Lead> {
    await this.ensureInitialized();

    const id = `lead-${Date.now()}`;
    const position = this.inMemoryLeads.size + 1;
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id,
      position,
      createdAt: now,
      updatedAt: now,
    } as Lead;

    this.inMemoryLeads.set(id, newLead);

    try {
      const leadsCol = await getMongoCollection<Lead>("leads");
      if (leadsCol) {
        await leadsCol.insertOne({ ...newLead });
        console.log(`[MongoDB] Successfully persisted lead ${id} (${newLead.email}) to Atlas.`);
      }
    } catch (err) {
      console.warn("[MongoDB] createLead write to Atlas failed, retained locally:", err);
    }

    return newLead;
  }

  public async updateLead(
    id: string,
    updates: Partial<Omit<Lead, "id" | "createdAt">>,
  ): Promise<Lead | undefined> {
    await this.ensureInitialized();

    const current = this.inMemoryLeads.get(id);
    if (!current) return undefined;

    const updated: Lead = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.inMemoryLeads.set(id, updated);

    try {
      const leadsCol = await getMongoCollection<Lead>("leads");
      if (leadsCol) {
        await leadsCol.updateOne({ id }, { $set: { ...updates, updatedAt: updated.updatedAt } });
      }
    } catch (err) {
      console.warn("[MongoDB] updateLead Atlas write failed:", err);
    }

    return updated;
  }

  public async deleteLead(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const existed = this.inMemoryLeads.delete(id);

    try {
      const leadsCol = await getMongoCollection<Lead>("leads");
      if (leadsCol) {
        const res = await leadsCol.deleteOne({ id });
        return (res.deletedCount ?? 0) > 0 || existed;
      }
    } catch (err) {
      console.warn("[MongoDB] deleteLead Atlas write failed:", err);
    }

    return existed;
  }

  public async getCrmStats(): Promise<CrmStats> {
    const leads = await this.getAllLeads();
    const leadsByStatus: Record<LeadStatus, number> = {
      "New Lead": 0,
      Contacted: 0,
      Qualified: 0,
      "Pro Trial": 0,
      "Closed Won": 0,
      "Enterprise Pilot": 0,
      Lost: 0,
    };

    let totalValue = 0;
    let closedCount = 0;

    for (const l of leads) {
      if (leadsByStatus[l.status] !== undefined) {
        leadsByStatus[l.status]++;
      }
      totalValue += l.dealValue || 0;
      if (l.status === "Closed Won" || l.status === "Enterprise Pilot") {
        closedCount++;
      }
    }

    const conversionRate = leads.length > 0 ? Math.round((closedCount / leads.length) * 100) : 0;

    return {
      totalLeads: leads.length,
      totalPipelineValue: totalValue,
      pipelineValue: totalValue,
      activeTrials: leadsByStatus["Pro Trial"] || 0,
      proTrials: leadsByStatus["Pro Trial"] || 0,
      qualifiedLeads: leadsByStatus["Qualified"] || 0,
      conversionRate,
      leadsByStatus,
    };
  }

  // ---------------------------------------------------------------------------
  // User Feedback & Telemetry
  // ---------------------------------------------------------------------------
  public async submitFeedback(input: {
    name?: string;
    email?: string;
    category?: "feature" | "bug" | "latency" | "general";
    rating?: number;
    message: string;
    source?: string;
  }): Promise<UserFeedback> {
    const feedback: UserFeedback = {
      id: `fb-${Date.now()}`,
      name: input.name?.trim() || "Anonymous Builder",
      email: input.email?.trim() || "",
      category: input.category || "general",
      rating: input.rating || 5,
      message: input.message.trim(),
      source: input.source || "launchpad-web",
      createdAt: new Date().toISOString(),
    };

    try {
      const col = await getMongoCollection<UserFeedback>("feedback");
      if (col) {
        await col.insertOne({ ...feedback });
        console.log(`[MongoDB] Feedback recorded in Atlas: ${feedback.id}`);
      }
    } catch (err) {
      console.warn("[MongoDB] submitFeedback failed to record to Atlas:", err);
    }

    return feedback;
  }

  public async recordTelemetry(event: {
    eventType: TelemetryEvent["eventType"];
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      const col = await getMongoCollection<TelemetryEvent>("telemetry");
      if (col) {
        await col.insertOne({
          id: `tel-${Date.now()}`,
          eventType: event.eventType,
          metadata: event.metadata || {},
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      // Best-effort telemetry
    }
  }

  // ---------------------------------------------------------------------------
  // Database Health Status
  // ---------------------------------------------------------------------------
  public async getDatabaseStatus() {
    const mongoHealth = await pingMongo();
    const leads = await this.getAllLeads();

    return {
      engine: mongoHealth.connected ? ("mongodb" as const) : ("in-memory" as const),
      connected: mongoHealth.connected,
      latencyMs: mongoHealth.latencyMs,
      error: mongoHealth.error,
      dbName: mongoHealth.dbName,
      counts: {
        leads: leads.length,
        users: this.inMemoryUsers.size,
      },
    };
  }

  public async resetInitialData(): Promise<void> {
    this.inMemoryUsers.clear();
    this.inMemoryLeads.clear();
    this.seedFallbackData();

    try {
      const usersCol = await getMongoCollection<User>("users");
      const leadsCol = await getMongoCollection<Lead>("leads");

      if (usersCol) {
        await usersCol.deleteMany({});
        await usersCol.insertMany(Array.from(this.inMemoryUsers.values()));
      }
      if (leadsCol) {
        await leadsCol.deleteMany({});
        await leadsCol.insertMany(Array.from(this.inMemoryLeads.values()));
      }
      console.log("[MongoDB] Collections 'users' and 'leads' successfully reset to initial seed.");
    } catch (err) {
      console.warn("[MongoDB] Reset failed:", err);
    }
  }

  public async getAppVersionConfig(): Promise<{
    latestVersion: string;
    minRequiredVersion: string;
    mandatory: boolean;
    downloadUrl: string;
    directExeUrl: string;
    webPortalUrl: string;
    releaseNotes: string;
    releaseDate: string;
  }> {
    try {
      const configCol = await getMongoCollection<any>("app_config");
      if (configCol) {
        const doc = await configCol.findOne({ key: "version_control" });
        if (doc) {
          return {
            latestVersion: doc.latestVersion || "1.0.0",
            minRequiredVersion: doc.minRequiredVersion || "1.0.0",
            mandatory: doc.mandatory !== false,
            downloadUrl: doc.downloadUrl || "https://github.com/Narayaaana11/VESPER/releases/download/v1.0.0/setup.exe",
            directExeUrl: doc.directExeUrl || "https://github.com/Narayaaana11/VESPER/releases/download/v1.0.0/VESPER-Setup-1.0.0.exe",
            webPortalUrl: doc.webPortalUrl || "https://vesperflow-ai.vercel.app/#download",
            releaseNotes: doc.releaseNotes || "VESPER v1.0 Production Release with ambient voice intelligence and MongoDB Atlas integration.",
            releaseDate: doc.releaseDate || "2026-10-12",
          };
        }
      }
    } catch (err) {
      console.warn("[MongoDB] getAppVersionConfig failed, returning environment defaults:", err);
    }

    return {
      latestVersion: process.env["APP_LATEST_VERSION"] || "1.0.0",
      minRequiredVersion: process.env["APP_MIN_VERSION"] || "1.0.0",
      mandatory: process.env["APP_UPDATE_MANDATORY"] !== "false",
      downloadUrl: "https://github.com/Narayaaana11/VESPER/releases/download/v1.0.0/setup.exe",
      directExeUrl: "https://github.com/Narayaaana11/VESPER/releases/download/v1.0.0/VESPER-Setup-1.0.0.exe",
      webPortalUrl: "https://vesperflow-ai.vercel.app/#download",
      releaseNotes: "VESPER v1.0 Production Release with ambient voice intelligence and MongoDB Atlas integration.",
      releaseDate: "2026-10-12",
    };
  }

  public async setAppVersionConfig(payload: {
    latestVersion?: string;
    minRequiredVersion?: string;
    mandatory?: boolean;
    downloadUrl?: string;
    directExeUrl?: string;
    webPortalUrl?: string;
    releaseNotes?: string;
  }): Promise<any> {
    const current = await this.getAppVersionConfig();
    const updated = {
      key: "version_control",
      latestVersion: payload.latestVersion || current.latestVersion,
      minRequiredVersion: payload.minRequiredVersion || current.minRequiredVersion,
      mandatory: payload.mandatory !== undefined ? payload.mandatory : current.mandatory,
      downloadUrl: payload.downloadUrl || current.downloadUrl,
      directExeUrl: payload.directExeUrl || current.directExeUrl,
      webPortalUrl: payload.webPortalUrl || current.webPortalUrl,
      releaseNotes: payload.releaseNotes || current.releaseNotes,
      releaseDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const configCol = await getMongoCollection<any>("app_config");
      if (configCol) {
        await configCol.updateOne(
          { key: "version_control" },
          { $set: updated },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn("[MongoDB] setAppVersionConfig Atlas write failed:", err);
    }

    return updated;
  }
}

export const db = new Database();
