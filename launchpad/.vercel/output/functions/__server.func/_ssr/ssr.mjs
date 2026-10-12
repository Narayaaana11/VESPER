//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var uri = process.env["MONGODB_URI"] || "";
var dbName = process.env["MONGODB_DB_NAME"] || "vesper";
var globalForMongo = globalThis;
var state = globalForMongo._mongoConnectionState ?? {
	client: null,
	db: null,
	isConnected: false,
	isConnecting: false,
	lastError: null,
	lastPingMs: null
};
globalForMongo._mongoConnectionState = state;
async function getMongoDriver() {
	try {
		// @vite-ignore prevents Vite/Rolldown from statically packaging CJS socket dependencies into client or edge worker builds
		const mod = await import(
			/* @vite-ignore */
			"mongodb"
);
		return {
			MongoClient: mod.MongoClient,
			ServerApiVersion: mod.ServerApiVersion
		};
	} catch (err) {
		console.warn("[MongoDB] Driver could not be loaded dynamically:", err);
		return null;
	}
}
async function getMongoDb() {
	if (state.db && state.isConnected) return state.db;
	if (state.isConnecting) for (let i = 0; i < 20; i++) {
		await new Promise((r) => setTimeout(r, 100));
		if (state.isConnected && state.db) return state.db;
		if (!state.isConnecting) break;
	}
	state.isConnecting = true;
	state.lastError = null;
	try {
		if (!uri) {
			state.lastError = "MONGODB_URI is not set in environment. Using in-memory fallback store.";
			state.isConnected = false;
			return null;
		}
		const driver = await getMongoDriver();
		if (!driver) {
			state.lastError = "MongoDB driver not available in current runtime";
			state.isConnected = false;
			return null;
		}
		const { MongoClient, ServerApiVersion } = driver;
		const client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: false,
				deprecationErrors: true
			},
			connectTimeoutMS: 5e3,
			serverSelectionTimeoutMS: 5e3,
			socketTimeoutMS: 1e4,
			maxPoolSize: 10,
			minPoolSize: 1
		});
		await client.connect();
		const pingStart = performance.now();
		await client.db(dbName).command({ ping: 1 });
		const latency = Math.round(performance.now() - pingStart);
		state.client = client;
		state.db = client.db(dbName);
		state.isConnected = true;
		state.lastPingMs = latency;
		state.lastError = null;
		console.log(`[MongoDB] Connected successfully to cluster (ping: ${latency}ms, db: ${dbName})`);
		return state.db;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		state.lastError = message;
		state.isConnected = false;
		state.client = null;
		state.db = null;
		console.warn(`[MongoDB] Connection failed, using in-memory resilient fallback: ${message}`);
		return null;
	} finally {
		state.isConnecting = false;
	}
}
async function getMongoCollection(collectionName) {
	const db = await getMongoDb();
	if (!db) return null;
	return db.collection(collectionName);
}
async function pingMongo() {
	if (!state.client || !state.isConnected) {
		if (!await getMongoDb()) return {
			connected: false,
			latencyMs: null,
			error: state.lastError || "Not connected to MongoDB",
			dbName
		};
	}
	try {
		const start = performance.now();
		await state.client.db(dbName).command({ ping: 1 });
		const latencyMs = Math.round(performance.now() - start);
		state.lastPingMs = latencyMs;
		return {
			connected: true,
			latencyMs,
			error: null,
			dbName
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		state.isConnected = false;
		state.lastError = msg;
		return {
			connected: false,
			latencyMs: null,
			error: msg,
			dbName
		};
	}
}
var Database = class {
	inMemoryUsers = /* @__PURE__ */ new Map();
	inMemoryLeads = /* @__PURE__ */ new Map();
	initialized = false;
	initializingPromise = null;
	constructor() {
		this.seedFallbackData();
	}
	seedFallbackData() {
		const adminUser = {
			id: "usr-admin-narayana",
			name: "Narayana",
			email: (process.env["ADMIN_EMAIL"] || "narayana@vesper.com").toLowerCase().trim(),
			avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NarayanaAdmin",
			role: "admin",
			provider: "local",
			passwordHash: process.env["ADMIN_PASSWORD"] || "Narayana@11",
			isVerified: true,
			tier: "enterprise",
			licenseKey: "VESPER-ADMN-2026-ROOT",
			licenseActive: true,
			usageQuota: {
				totalSeconds: 36e4,
				usedSeconds: 0,
				periodReset: new Date(Date.now() + 2592e6).toISOString()
			},
			tokenQuota: {
				monthlyAllowance: 1e7,
				usedTokens: 0,
				promptTokens: 0,
				completionTokens: 0,
				periodReset: new Date(Date.now() + 2592e6).toISOString()
			},
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.inMemoryUsers.set(adminUser.id, adminUser);
		this.inMemoryLeads.clear();
	}
	async ensureInitialized() {
		if (this.initialized) return;
		if (this.initializingPromise) return this.initializingPromise;
		this.initializingPromise = (async () => {
			try {
				const usersCol = await getMongoCollection("users");
				const leadsCol = await getMongoCollection("leads");
				if (usersCol && leadsCol) {
					if (await usersCol.countDocuments() === 0) {
						const seedUsers = Array.from(this.inMemoryUsers.values());
						await usersCol.insertMany(seedUsers);
						console.log(`[MongoDB] Seeded root admin user into Atlas collection 'users'.`);
					} else {
						const users = await usersCol.find({}).toArray();
						this.inMemoryUsers.clear();
						users.forEach((u) => this.inMemoryUsers.set(u.id, u));
					}
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
	async findUserByEmail(email) {
		await this.ensureInitialized();
		const cleanEmail = email.trim().toLowerCase();
		try {
			const usersCol = await getMongoCollection("users");
			if (usersCol) {
				const found = await usersCol.findOne({ email: cleanEmail });
				if (found) {
					this.inMemoryUsers.set(found.id, found);
					return found;
				}
			}
		} catch {}
		for (const u of this.inMemoryUsers.values()) if (u.email.toLowerCase() === cleanEmail) return u;
	}
	async findUserById(id) {
		await this.ensureInitialized();
		try {
			const usersCol = await getMongoCollection("users");
			if (usersCol) {
				const found = await usersCol.findOne({ id });
				if (found) {
					this.inMemoryUsers.set(found.id, found);
					return found;
				}
			}
		} catch {}
		return this.inMemoryUsers.get(id);
	}
	async createUser(user) {
		await this.ensureInitialized();
		this.inMemoryUsers.set(user.id, user);
		try {
			const usersCol = await getMongoCollection("users");
			if (usersCol) await usersCol.insertOne({ ...user });
		} catch (err) {
			console.warn("[MongoDB] createUser failed to write to Atlas, cached locally:", err);
		}
		return user;
	}
	async getAllUsers() {
		await this.ensureInitialized();
		try {
			const usersCol = await getMongoCollection("users");
			if (usersCol) {
				const docs = await usersCol.find({}).sort({ createdAt: -1 }).toArray();
				if (docs.length > 0) {
					this.inMemoryUsers.clear();
					docs.forEach((u) => this.inMemoryUsers.set(u.id, u));
					return docs;
				}
			}
		} catch {}
		return Array.from(this.inMemoryUsers.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
	async updateUser(id, updates) {
		await this.ensureInitialized();
		const current = await this.findUserById(id);
		if (!current) return void 0;
		const updated = {
			...current,
			...updates
		};
		this.inMemoryUsers.set(id, updated);
		try {
			const usersCol = await getMongoCollection("users");
			if (usersCol) await usersCol.updateOne({ id }, { $set: { ...updates } });
		} catch (err) {
			console.warn("[MongoDB] updateUser Atlas write failed:", err);
		}
		return updated;
	}
	async recordUserTokens(userId, tokens) {
		const user = await this.findUserById(userId);
		if (!user) return void 0;
		const currentQuota = user.tokenQuota || {
			monthlyAllowance: user.tier === "enterprise" ? 1e7 : user.tier === "pro" ? 5e6 : 5e5,
			usedTokens: 0,
			promptTokens: 0,
			completionTokens: 0,
			periodReset: new Date(Date.now() + 2592e6).toISOString()
		};
		const updatedQuota = {
			...currentQuota,
			usedTokens: currentQuota.usedTokens + (tokens.totalTokens || tokens.promptTokens + tokens.completionTokens),
			promptTokens: currentQuota.promptTokens + (tokens.promptTokens || 0),
			completionTokens: currentQuota.completionTokens + (tokens.completionTokens || 0)
		};
		return await this.updateUser(userId, { tokenQuota: updatedQuota });
	}
	async findUserByLicenseKey(licenseKey) {
		await this.ensureInitialized();
		const cleanKey = licenseKey.trim().toUpperCase();
		try {
			const usersCol = await getMongoCollection("users");
			if (usersCol) {
				const found = await usersCol.findOne({ licenseKey: cleanKey });
				if (found) {
					this.inMemoryUsers.set(found.id, found);
					return found;
				}
			}
		} catch {}
		for (const u of this.inMemoryUsers.values()) if (u.licenseKey.toUpperCase() === cleanKey) return u;
	}
	async verifyUserEmail(email, tokenOrPin) {
		await this.ensureInitialized();
		const cleanEmail = email.trim().toLowerCase();
		const cleanInput = tokenOrPin.trim();
		const user = await this.findUserByEmail(cleanEmail);
		if (!user) return {
			success: false,
			error: "No account registered with this email address."
		};
		if (user.isVerified) return {
			success: true,
			user
		};
		const matchesToken = user.verificationToken && user.verificationToken === cleanInput;
		const matchesPin = user.verificationPin && user.verificationPin === cleanInput;
		if (!matchesToken && !matchesPin) return {
			success: false,
			error: "Invalid verification PIN or security token."
		};
		if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < /* @__PURE__ */ new Date()) return {
			success: false,
			error: "Verification token has expired. Request a new code."
		};
		return {
			success: true,
			user: await this.updateUser(user.id, {
				isVerified: true,
				licenseActive: true,
				verificationToken: void 0,
				verificationPin: void 0,
				verificationTokenExpiry: void 0
			}) ?? user
		};
	}
	generateLicenseKey() {
		const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
		const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 32)]).join("");
		return `VESPER-${segment()}-${segment()}-${segment()}`;
	}
	async getAllLeads() {
		await this.ensureInitialized();
		try {
			const leadsCol = await getMongoCollection("leads");
			if (leadsCol) {
				const docs = await leadsCol.find({}).sort({ createdAt: -1 }).toArray();
				if (docs.length > 0) {
					this.inMemoryLeads.clear();
					docs.forEach((d) => this.inMemoryLeads.set(d.id, d));
					return docs;
				}
			}
		} catch {}
		return Array.from(this.inMemoryLeads.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
	async findLeadById(id) {
		await this.ensureInitialized();
		try {
			const leadsCol = await getMongoCollection("leads");
			if (leadsCol) {
				const found = await leadsCol.findOne({ id });
				if (found) {
					this.inMemoryLeads.set(found.id, found);
					return found;
				}
			}
		} catch {}
		return this.inMemoryLeads.get(id);
	}
	async createLead(leadData) {
		await this.ensureInitialized();
		const id = `lead-${Date.now()}`;
		const position = this.inMemoryLeads.size + 1;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const newLead = {
			...leadData,
			id,
			position,
			createdAt: now,
			updatedAt: now
		};
		this.inMemoryLeads.set(id, newLead);
		try {
			const leadsCol = await getMongoCollection("leads");
			if (leadsCol) {
				await leadsCol.insertOne({ ...newLead });
				console.log(`[MongoDB] Successfully persisted lead ${id} (${newLead.email}) to Atlas.`);
			}
		} catch (err) {
			console.warn("[MongoDB] createLead write to Atlas failed, retained locally:", err);
		}
		return newLead;
	}
	async updateLead(id, updates) {
		await this.ensureInitialized();
		const current = this.inMemoryLeads.get(id);
		if (!current) return void 0;
		const updated = {
			...current,
			...updates,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.inMemoryLeads.set(id, updated);
		try {
			const leadsCol = await getMongoCollection("leads");
			if (leadsCol) await leadsCol.updateOne({ id }, { $set: {
				...updates,
				updatedAt: updated.updatedAt
			} });
		} catch (err) {
			console.warn("[MongoDB] updateLead Atlas write failed:", err);
		}
		return updated;
	}
	async deleteLead(id) {
		await this.ensureInitialized();
		const existed = this.inMemoryLeads.delete(id);
		try {
			const leadsCol = await getMongoCollection("leads");
			if (leadsCol) return ((await leadsCol.deleteOne({ id })).deletedCount ?? 0) > 0 || existed;
		} catch (err) {
			console.warn("[MongoDB] deleteLead Atlas write failed:", err);
		}
		return existed;
	}
	async getCrmStats() {
		const leads = await this.getAllLeads();
		const leadsByStatus = {
			"New Lead": 0,
			Contacted: 0,
			Qualified: 0,
			"Pro Trial": 0,
			"Closed Won": 0,
			"Enterprise Pilot": 0,
			Lost: 0
		};
		let totalValue = 0;
		let closedCount = 0;
		for (const l of leads) {
			if (leadsByStatus[l.status] !== void 0) leadsByStatus[l.status]++;
			totalValue += l.dealValue || 0;
			if (l.status === "Closed Won" || l.status === "Enterprise Pilot") closedCount++;
		}
		const conversionRate = leads.length > 0 ? Math.round(closedCount / leads.length * 100) : 0;
		return {
			totalLeads: leads.length,
			totalPipelineValue: totalValue,
			pipelineValue: totalValue,
			activeTrials: leadsByStatus["Pro Trial"] || 0,
			proTrials: leadsByStatus["Pro Trial"] || 0,
			qualifiedLeads: leadsByStatus["Qualified"] || 0,
			conversionRate,
			leadsByStatus
		};
	}
	async submitFeedback(input) {
		const feedback = {
			id: `fb-${Date.now()}`,
			name: input.name?.trim() || "Anonymous Builder",
			email: input.email?.trim() || "",
			category: input.category || "general",
			rating: input.rating || 5,
			message: input.message.trim(),
			source: input.source || "launchpad-web",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			const col = await getMongoCollection("feedback");
			if (col) {
				await col.insertOne({ ...feedback });
				console.log(`[MongoDB] Feedback recorded in Atlas: ${feedback.id}`);
			}
		} catch (err) {
			console.warn("[MongoDB] submitFeedback failed to record to Atlas:", err);
		}
		return feedback;
	}
	async recordTelemetry(event) {
		try {
			const col = await getMongoCollection("telemetry");
			if (col) await col.insertOne({
				id: `tel-${Date.now()}`,
				eventType: event.eventType,
				metadata: event.metadata || {},
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch {}
	}
	async getDatabaseStatus() {
		const mongoHealth = await pingMongo();
		const leads = await this.getAllLeads();
		return {
			engine: mongoHealth.connected ? "mongodb" : "in-memory",
			connected: mongoHealth.connected,
			latencyMs: mongoHealth.latencyMs,
			error: mongoHealth.error,
			dbName: mongoHealth.dbName,
			counts: {
				leads: leads.length,
				users: this.inMemoryUsers.size
			}
		};
	}
	async resetInitialData() {
		this.inMemoryUsers.clear();
		this.inMemoryLeads.clear();
		this.seedFallbackData();
		try {
			const usersCol = await getMongoCollection("users");
			const leadsCol = await getMongoCollection("leads");
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
};
var db = new Database();
var MailerService = class {
	transporterPromise = null;
	async getTransporter() {
		if (this.transporterPromise) return this.transporterPromise;
		this.transporterPromise = (async () => {
			try {
				const nodemailerModule = await import(
					/* @vite-ignore */
					"nodemailer"
);
				const nodemailer = nodemailerModule.default || nodemailerModule;
				const host = process.env["SMTP_HOST"];
				const port = Number(process.env["SMTP_PORT"]) || 587;
				const user = process.env["SMTP_USER"];
				const pass = process.env["SMTP_PASS"];
				if (host && user && pass) {
					console.log(`[VESPER Mailer] Initializing production SMTP transporter (${host}:${port})...`);
					return nodemailer.createTransport({
						host,
						port,
						secure: port === 465,
						auth: {
							user,
							pass
						}
					});
				}
				console.log("[VESPER Mailer] No SMTP credentials detected in environment. Using development simulated mailer.");
				return null;
			} catch (err) {
				console.warn("[VESPER Mailer] Nodemailer dynamic initialization error:", err);
				return null;
			}
		})();
		return this.transporterPromise;
	}
	async sendMail(options) {
		const fromAddress = process.env["SMTP_FROM"] || "VESPER Systems <contact@vesper.ai>";
		try {
			const transporter = await this.getTransporter();
			if (transporter) {
				const info = await transporter.sendMail({
					from: fromAddress,
					to: options.to,
					subject: options.subject,
					html: options.html,
					text: options.text || options.subject
				});
				console.log(`[VESPER Mailer] Email dispatched to ${options.to} (ID: ${info.messageId})`);
				return {
					success: true,
					messageId: info.messageId
				};
			}
			const simulatedId = `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			console.log(`\n================== [VESPER MAIL DISPATCHED] ==================`);
			console.log(`To:      ${options.to}`);
			console.log(`Subject: ${options.subject}`);
			console.log(`ID:      ${simulatedId}`);
			console.log(`=============================================================\n`);
			return {
				success: true,
				messageId: simulatedId
			};
		} catch (err) {
			console.error(`[VESPER Mailer] Failed to send email to ${options.to}:`, err);
			return {
				success: false,
				messageId: "",
				error: err?.message || "Unknown SMTP error"
			};
		}
	}
	async sendVerificationEmail(to, name, token, pin, licenseKey, origin = "http://localhost:8080") {
		const verifyUrl = `${origin}/api/auth/verify-email?email=${encodeURIComponent(to)}&token=${encodeURIComponent(token)}`;
		const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify your VESPER Account & License</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c0e; color: #f4f4f7; margin: 0; padding: 32px 16px; }
    .card { max-width: 540px; margin: 0 auto; background-color: #111215; border: 1px solid #23252a; border-radius: 12px; padding: 36px; box-shadow: 0 16px 40px rgba(0,0,0,0.8); }
    .brand { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.2em; color: #ff6b00; margin-bottom: 24px; display: flex; align-items: center; }
    .heading { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #9a9cae; margin-bottom: 24px; }
    .code-box { background-color: #17181c; border: 1px solid #282a30; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 28px; }
    .pin { font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.3em; color: #ff6b00; }
    .btn { display: inline-block; background-color: #ff6b00; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; text-align: center; }
    .license-box { background-color: #17181c; border-left: 3px solid #ff6b00; padding: 14px 18px; margin-top: 24px; border-radius: 4px; }
    .license-title { font-size: 11px; text-transform: uppercase; font-family: monospace; color: #9a9cae; margin-bottom: 4px; }
    .license-key { font-family: monospace; font-size: 15px; font-weight: 700; color: #f4f4f7; }
    .footer { font-size: 11px; color: #525462; margin-top: 32px; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">VESPER // SECURE PROTOCOL</div>
    <div class="heading">Verify Your Account</div>
    <p class="text">Hello ${name || "Developer"}, welcome to VESPER. Please verify your email to activate your account and software subscription license for the VESPER desktop application.</p>
    
    <div class="code-box">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9a9cae; margin-bottom: 6px;">Your 6-Digit Verification PIN</div>
      <div class="pin">${pin}</div>
    </div>

    <div style="text-align: center; margin-bottom: 28px;">
      <a href="${verifyUrl}" class="btn">Verify Account Instantly</a>
    </div>

    <div class="license-box">
      <div class="license-title">Your Assigned Desktop License Key</div>
      <div class="license-key">${licenseKey}</div>
    </div>

    <p class="footer">
      If you did not request this email, please ignore this transmission.<br>
      VESPER Systems &copy; 2026. Local-First Voice & Context Engine.
    </p>
  </div>
</body>
</html>
    `;
		return this.sendMail({
			to,
			subject: `[${pin}] Verify your VESPER Account & License`,
			html,
			text: `Your VESPER verification PIN is ${pin}. License Key: ${licenseKey}. Verify at: ${verifyUrl}`
		});
	}
	async sendInviteEmail(to, name, tier, licenseKey, origin = "http://localhost:8080") {
		const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your VESPER Access & License Key</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0c0e; color: #f4f4f7; margin: 0; padding: 32px 16px; }
    .card { max-width: 540px; margin: 0 auto; background-color: #111215; border: 1px solid #23252a; border-radius: 12px; padding: 36px; }
    .brand { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.2em; color: #ff6b00; margin-bottom: 24px; }
    .heading { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #9a9cae; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #ff6b00; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; text-align: center; }
    .license-box { background-color: #17181c; border-left: 3px solid #ff6b00; padding: 14px 18px; margin-top: 24px; border-radius: 4px; }
    .license-key { font-family: monospace; font-size: 15px; font-weight: 700; color: #f4f4f7; }
    .footer { font-size: 11px; color: #525462; margin-top: 32px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">VESPER // FOUNDER ACCESS</div>
    <div class="heading">Your VESPER ${tier.toUpperCase()} Access is Ready</div>
    <p class="text">Hello ${name}, you have been provisioned access to the VESPER ${tier.toUpperCase()} desktop application suite.</p>
    
    <div class="license-box">
      <div style="font-size: 11px; text-transform: uppercase; font-family: monospace; color: #9a9cae; margin-bottom: 4px;">Desktop License Key</div>
      <div class="license-key">${licenseKey}</div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${origin}/#download" class="btn">Download VESPER Desktop</a>
    </div>

    <p class="footer">VESPER Systems &copy; 2026. Local-First Voice & Context Engine.</p>
  </div>
</body>
</html>
    `;
		return this.sendMail({
			to,
			subject: `Your VESPER ${tier.toUpperCase()} License Key & Access`,
			html,
			text: `Hello ${name}, your VESPER ${tier} license key is: ${licenseKey}. Download the app at: ${origin}/#download`
		});
	}
	async sendWelcomeEmail(to, name, licenseKey, tier = "pro", origin = "http://localhost:8080") {
		const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to VESPER — Your License Key &amp; Getting Started</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c0e; color: #f4f4f7; margin: 0; padding: 32px 16px; }
    .card { max-width: 560px; margin: 0 auto; background-color: #111215; border: 1px solid #23252a; border-radius: 14px; padding: 36px; box-shadow: 0 16px 40px rgba(0,0,0,0.8); }
    .brand { font-family: monospace; font-size: 16px; font-weight: 700; letter-spacing: 0.2em; color: #ff6b00; margin-bottom: 20px; }
    .heading { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.65; color: #9a9cae; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #ff6b00; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 32px; border-radius: 9px; text-align: center; }
    .license-box { background-color: #17181c; border-left: 3px solid #ff6b00; padding: 16px 20px; margin: 24px 0; border-radius: 6px; }
    .license-title { font-size: 11px; text-transform: uppercase; font-family: monospace; color: #9a9cae; margin-bottom: 6px; }
    .license-key { font-family: monospace; font-size: 17px; font-weight: 700; color: #ff6b00; letter-spacing: 0.05em; }
    .feedback-box { background-color: #15161b; border: 1px solid #262830; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .feedback-title { font-size: 13px; font-weight: 600; color: #ffffff; margin-bottom: 6px; }
    .feedback-text { font-size: 13px; color: #9a9cae; line-height: 1.5; margin: 0; }
    .feedback-link { color: #ff6b00; text-decoration: none; font-weight: 600; }
    .footer { font-size: 11px; color: #525462; margin-top: 32px; text-align: center; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">VESPER // AMBIENT VOICE ENGINE</div>
    <div class="heading">Welcome to VESPER, ${name || "Developer"}!</div>
    
    <p class="text">
      Thank you for choosing VESPER! Your account has been created and verified instantly. You have immediate access to our low-latency push-to-talk ambient intelligence engine for Windows.
    </p>

    <div class="license-box">
      <div class="license-title">Your Assigned Desktop License Key (${tier.toUpperCase()} TIER)</div>
      <div class="license-key">${licenseKey}</div>
    </div>

    <p class="text">
      To get started, install VESPER Desktop, hold <strong style="color: #ffffff;">F8</strong> anywhere in Windows (Cursor, VS Code, Slack, or Word), speak naturally, and watch your voice injected directly at your cursor with sub-180ms latency.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${origin}/#download" class="btn">Download VESPER Desktop for Windows</a>
    </div>

    <div class="feedback-box">
      <div class="feedback-title">Your Feedback Shapes VESPER</div>
      <p class="feedback-text">
        We are building VESPER to be the fastest, most ergonomic voice productivity suite in the world. If you have any feedback, questions, or ideas, you can reply directly to this email or write to us anytime at <a href="mailto:contact@vesper.ai" class="feedback-link">contact@vesper.ai</a>. We read and respond to every note!
      </p>
    </div>

    <p class="footer">
      No email verification needed &mdash; your software license is active immediately.<br>
      VESPER Platform &copy; 2026. Local-First Voice &amp; Context Intelligence.
    </p>
  </div>
</body>
</html>
    `;
		return this.sendMail({
			to,
			subject: `Welcome to VESPER — Your ${tier.toUpperCase()} License Key & Getting Started`,
			html,
			text: `Hello ${name}! Thank you for joining VESPER. Your account is active and verified instantly with no verification needed. Your License Key: ${licenseKey}. Download VESPER at: ${origin}/#download. If you have any feedback, reply to this email or write to us at contact@vesper.ai!`
		});
	}
};
var mailer = new MailerService();
async function handleApiRequest(request) {
	const url = new URL(request.url);
	const pathname = url.pathname;
	if (!pathname.startsWith("/api/")) return null;
	const method = request.method.toUpperCase();
	const json = (data, status = 200) => {
		return new Response(JSON.stringify(data), {
			status,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization"
			}
		});
	};
	if (method === "OPTIONS") return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization"
		}
	});
	try {
		if (pathname === "/api/health" && method === "GET") {
			const dbStatus = await db.getDatabaseStatus();
			return json({
				status: "ok",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				database: dbStatus,
				service: "VESPER Production API",
				version: "1.0.0-release",
				uptimeSeconds: Math.round(process.uptime())
			});
		}
		const parseBody = async () => {
			try {
				const text = await request.text();
				return text ? JSON.parse(text) : {};
			} catch {
				return {};
			}
		};
		if (pathname === "/api/feedback" && method === "POST") {
			const body = await parseBody();
			if (!body.message || !body.message.trim()) return json({ error: "Feedback message cannot be empty." }, 400);
			return json({
				success: true,
				feedback: await db.submitFeedback({
					message: body.message,
					...body.name ? { name: body.name } : {},
					...body.email ? { email: body.email } : {},
					...typeof body.rating === "number" ? { rating: body.rating } : {},
					...body.category ? { category: body.category } : {},
					...body.source ? { source: body.source } : {}
				})
			}, 201);
		}
		if (pathname === "/api/telemetry" && method === "POST") {
			const body = await parseBody();
			if (body.eventType) await db.recordTelemetry({
				eventType: body.eventType,
				...body.metadata ? { metadata: body.metadata } : {}
			});
			return json({ received: true });
		}
		if (pathname === "/api/auth/login" && method === "POST") {
			const { email, password } = await parseBody();
			if (!email || !password) return json({ error: "Email and password are required." }, 400);
			const user = await db.findUserByEmail(email);
			if (!user || user.passwordHash !== password) return json({ error: "Invalid email or password." }, 401);
			return json({
				token: `vesper-token-${user.id}-${Date.now()}`,
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
					usageQuota: user.usageQuota
				}
			});
		}
		if (pathname === "/api/auth/signup" && method === "POST") {
			const { email, password, name } = await parseBody();
			if (!email || !password) return json({ error: "Email and password are required." }, 400);
			const cleanEmail = email.trim().toLowerCase();
			if (await db.findUserByEmail(cleanEmail)) return json({ error: "An account with this email already exists." }, 409);
			const pin = Math.floor(1e5 + Math.random() * 9e5).toString();
			const verificationToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
			const licenseKey = db.generateLicenseKey();
			const cleanName = name && name.trim() || cleanEmail.split("@")[0] || "User";
			const newUser = {
				id: `usr-${Date.now()}`,
				name: cleanName,
				email: cleanEmail,
				avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
				role: "user",
				provider: "local",
				passwordHash: password,
				isVerified: true,
				verificationPin: pin,
				verificationToken,
				verificationTokenExpiry: new Date(Date.now() + 36e5).toISOString(),
				tier: "pro",
				licenseKey,
				licenseActive: true,
				usageQuota: {
					totalSeconds: 72e3,
					usedSeconds: 0,
					periodReset: new Date(Date.now() + 2592e6).toISOString()
				},
				tokenQuota: {
					monthlyAllowance: 5e6,
					usedTokens: 0,
					promptTokens: 0,
					completionTokens: 0,
					periodReset: new Date(Date.now() + 2592e6).toISOString()
				},
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await db.createUser(newUser);
			const token = `vesper-token-${newUser.id}-${Date.now()}`;
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
					tokenQuota: newUser.tokenQuota
				}
			});
		}
		if (pathname === "/api/auth/google" && method === "POST") return json({
			success: false,
			error: "Google Sign-In is currently in progress. Please use email authentication — we are working on that."
		}, 400);
		if (pathname === "/api/auth/send-verification" && method === "POST") {
			const email = (await parseBody()).email?.trim().toLowerCase();
			if (!email) return json({ error: "Email is required." }, 400);
			let user = await db.findUserByEmail(email);
			const pin = Math.floor(1e5 + Math.random() * 9e5).toString();
			const verificationToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
			const licenseKey = user?.licenseKey || db.generateLicenseKey();
			const fallbackName = email.split("@")[0] || "User";
			if (!user) {
				const newUser = {
					id: `usr-${Date.now()}`,
					name: fallbackName,
					email,
					role: "user",
					provider: "local",
					isVerified: false,
					verificationPin: pin,
					verificationToken,
					verificationTokenExpiry: new Date(Date.now() + 36e5).toISOString(),
					tier: "free",
					licenseKey,
					licenseActive: false,
					usageQuota: {
						totalSeconds: 3600,
						usedSeconds: 0,
						periodReset: new Date(Date.now() + 2592e6).toISOString()
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				await db.createUser(newUser);
				user = newUser;
			} else await db.updateUser(user.id, {
				verificationPin: pin,
				verificationToken,
				verificationTokenExpiry: new Date(Date.now() + 36e5).toISOString(),
				licenseKey
			});
			const userName = user.name || fallbackName;
			const mailRes = await mailer.sendVerificationEmail(email, userName, verificationToken, pin, licenseKey, url.origin);
			return json({
				success: true,
				message: `Verification PIN dispatched to ${email}.`,
				pin,
				simulatedPin: pin,
				messageId: mailRes.messageId
			});
		}
		if (pathname === "/api/auth/verify-email" && method === "POST") {
			const body = await parseBody();
			const email = body.email?.trim().toLowerCase();
			const code = body.code || body.pin || body.token;
			if (!email || !code) return json({ error: "Email and verification code/token are required." }, 400);
			const result = await db.verifyUserEmail(email, code);
			if (!result.success || !result.user) return json({ error: result.error || "Verification failed." }, 400);
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
					licenseActive: result.user.licenseActive
				},
				licenseKey: result.user.licenseKey,
				tier: result.user.tier
			});
		}
		if (pathname === "/api/auth/verify-email" && method === "GET") {
			const email = url.searchParams.get("email") || "";
			const token = url.searchParams.get("token") || "";
			if (email && token) {
				const result = await db.verifyUserEmail(email, token);
				if (result.success) return Response.redirect(`${url.origin}/guidance?verified=true&license=${result.user?.licenseKey || ""}`, 302);
			}
			return json({ error: "Invalid or expired email verification link." }, 400);
		}
		if (pathname === "/api/license/verify" && method === "POST") {
			const body = await parseBody();
			const licenseKey = body.licenseKey?.trim().toUpperCase();
			if (!licenseKey) return json({
				valid: false,
				error: "License key is required."
			}, 400);
			const user = await db.findUserByLicenseKey(licenseKey);
			if (!user) return json({
				valid: false,
				error: "License key not recognized. Register at vesper.com to generate your key."
			}, 404);
			if (!user.isVerified) return json({
				valid: false,
				error: "Account unverified. Please verify your email to unlock desktop app usage.",
				requiresEmailVerification: true,
				email: user.email
			}, 403);
			if (!user.licenseActive) return json({
				valid: false,
				error: "License key has been paused or expired. Upgrade your plan at vesper.com."
			}, 403);
			if (body.machineId) {
				const boundDevices = Array.isArray(user.boundDevices) ? [...user.boundDevices] : [];
				const existingIdx = boundDevices.findIndex((d) => d.machineId === body.machineId);
				if (existingIdx >= 0) {
					boundDevices[existingIdx].activatedAt = (/* @__PURE__ */ new Date()).toISOString();
					if (body.machineName) boundDevices[existingIdx].machineName = body.machineName;
				} else boundDevices.push({
					machineId: body.machineId,
					machineName: body.machineName || "Windows Workstation",
					activatedAt: (/* @__PURE__ */ new Date()).toISOString()
				});
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
					role: user.role
				},
				quota: {
					totalSeconds: user.usageQuota?.totalSeconds ?? 36e3,
					usedSeconds: user.usageQuota?.usedSeconds ?? 0,
					remainingSeconds: Math.max(0, (user.usageQuota?.totalSeconds ?? 36e3) - (user.usageQuota?.usedSeconds ?? 0)),
					remainingMinutes: Math.round(Math.max(0, (user.usageQuota?.totalSeconds ?? 36e3) - (user.usageQuota?.usedSeconds ?? 0)) / 60),
					periodReset: user.usageQuota?.periodReset || new Date(Date.now() + 2592e6).toISOString()
				},
				tokenQuota: {
					monthlyAllowance: user.tokenQuota?.monthlyAllowance ?? (user.tier === "enterprise" ? 1e7 : user.tier === "pro" ? 5e6 : 5e5),
					usedTokens: user.tokenQuota?.usedTokens ?? 0,
					remainingTokens: Math.max(0, (user.tokenQuota?.monthlyAllowance ?? 5e5) - (user.tokenQuota?.usedTokens ?? 0)),
					periodReset: user.tokenQuota?.periodReset || new Date(Date.now() + 2592e6).toISOString()
				},
				engineConfig: {
					neuralPipeline: "vesper-ultra-latency",
					hardwareAcceleration: "DirectML / CUDA / NPU",
					localFallback: true,
					latencyTargetMs: 140
				}
			});
		}
		if (pathname === "/api/download/windows" && (method === "GET" || method === "HEAD")) {
			const fs = await import("node:fs");
			const path = await import("node:path");
			const publicExe = path.resolve(process.cwd(), "public/downloads/VESPER-Setup-1.0.0.exe");
			const prodDistExe = path.resolve(process.cwd(), "../Production/dist/VESPER-Setup-1.0.0.exe");
			const exePath = fs.existsSync(publicExe) ? publicExe : fs.existsSync(prodDistExe) ? prodDistExe : null;
			if (exePath) {
				const stats = fs.statSync(exePath);
				if (method === "HEAD") return new Response(null, { headers: {
					"Content-Type": "application/vnd.microsoft.portable-executable",
					"Content-Disposition": "attachment; filename=\"VESPER-Setup-1.0.0.exe\"",
					"Content-Length": stats.size.toString(),
					"Access-Control-Allow-Origin": "*"
				} });
				const stream = fs.createReadStream(exePath);
				let isClosed = false;
				const readableStream = new ReadableStream({
					start(controller) {
						stream.on("data", (chunk) => {
							if (!isClosed) try {
								controller.enqueue(chunk);
							} catch {
								isClosed = true;
								stream.destroy();
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
					}
				});
				return new Response(readableStream, { headers: {
					"Content-Type": "application/vnd.microsoft.portable-executable",
					"Content-Disposition": "attachment; filename=\"VESPER-Setup-1.0.0.exe\"",
					"Content-Length": stats.size.toString(),
					"Access-Control-Allow-Origin": "*"
				} });
			}
			return json({
				available: false,
				message: "Installer binaries are compiling or ready via Production bundle.",
				downloadUrl: "/downloads/VESPER-Setup-1.0.0.exe",
				checksumSha256: "9c2639de9aa7012d3855a2335993c17322258e2bbbc800bbacad16e053f91d7f",
				version: "1.0.0"
			});
		}
		if (pathname === "/api/geo" && method === "GET") {
			const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || "";
			try {
				if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
					const geoRes = await fetch(`https://freeipapi.com/api/json/${clientIp}`, { signal: AbortSignal.timeout(3e3) });
					if (geoRes.ok) {
						const data = await geoRes.json();
						return json({
							ip: data.ipAddress || clientIp,
							countryCode: data.countryCode || "US",
							countryName: data.countryName || "United States",
							cityName: data.cityName || "Unknown",
							currency: data.currency?.code || "USD",
							timeZone: data.timeZone || "UTC",
							provider: "freeipapi.com (free-for.dev)"
						});
					}
				}
			} catch {}
			return json({
				ip: "127.0.0.1",
				countryCode: "US",
				countryName: "United States",
				cityName: "Local Workstation",
				currency: "USD",
				timeZone: "UTC",
				provider: "local-fallback"
			});
		}
		if (pathname === "/api/auth/me" && method === "GET") {
			const match = (request.headers.get("Authorization") || "").match(/Bearer vesper-token-(usr-[^ -]+)/);
			if (!match || !match[1]) return json({ error: "Unauthorized. Missing or invalid Bearer token." }, 401);
			const userId = match[1];
			const user = await db.findUserById(userId);
			if (!user) return json({ error: "User session expired or not found." }, 401);
			return json({ user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				provider: user.provider
			} });
		}
		if (pathname === "/api/crm/stats" && method === "GET") return json(await db.getCrmStats());
		if (pathname === "/api/crm/leads" && method === "GET") {
			const q = url.searchParams.get("q")?.toLowerCase() || "";
			const statusFilter = url.searchParams.get("status") || "";
			let leads = await db.getAllLeads();
			if (statusFilter && statusFilter !== "All") leads = leads.filter((l) => l.status === statusFilter);
			if (q) leads = leads.filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company && l.company.toLowerCase().includes(q) || l.hardware && l.hardware.toLowerCase().includes(q) || l.useCase.toLowerCase().includes(q));
			return json({
				leads,
				count: leads.length
			});
		}
		if (pathname === "/api/crm/leads" && method === "POST") {
			const leadInput = await parseBody();
			if (!leadInput.name || !leadInput.email) return json({ error: "Lead name and email are required." }, 400);
			return json({ lead: await db.createLead({
				name: leadInput.name.trim(),
				email: leadInput.email.trim(),
				company: leadInput.company?.trim() || "",
				useCase: leadInput.useCase || "Developer / Engineer",
				platforms: leadInput.platforms || ["Windows Power User"],
				hardware: leadInput.hardware || "NVIDIA RTX / Intel NPU",
				status: leadInput.status || "New Lead",
				dealValue: leadInput.dealValue || 120,
				notes: leadInput.notes || "Lead generated via VESPER launchpad portal."
			}) }, 201);
		}
		if (pathname.startsWith("/api/crm/leads/") && method === "PATCH") {
			const leadId = pathname.replace("/api/crm/leads/", "");
			const updates = await parseBody();
			const updated = await db.updateLead(leadId, updates);
			if (!updated) return json({ error: "Lead not found." }, 404);
			return json({ lead: updated });
		}
		if (pathname.startsWith("/api/crm/leads/") && method === "DELETE") {
			const leadId = pathname.replace("/api/crm/leads/", "");
			if (!await db.deleteLead(leadId)) return json({ error: "Lead not found." }, 404);
			return json({
				success: true,
				message: "Lead removed from CRM database."
			});
		}
		if (pathname === "/api/admin/metrics" && method === "GET") {
			const users = await db.getAllUsers();
			const leads = await db.getAllLeads();
			const crmStats = await db.getCrmStats();
			const totalUsers = users.length;
			const activeWorkstations = users.filter((u) => u.licenseActive).length;
			const verifiedUsers = users.filter((u) => u.isVerified).length;
			const payingCustomers = users.filter((u) => u.tier === "pro" || u.tier === "enterprise").length;
			return json({
				success: true,
				metrics: {
					totalUsers,
					activeWorkstations,
					verifiedUsers,
					payingCustomers,
					totalTokensBurned: users.reduce((acc, u) => acc + (u.tokenQuota?.usedTokens || 0), 0),
					totalPromptTokens: users.reduce((acc, u) => acc + (u.tokenQuota?.promptTokens || 0), 0),
					totalCompletionTokens: users.reduce((acc, u) => acc + (u.tokenQuota?.completionTokens || 0), 0),
					pipelineValue: crmStats.totalPipelineValue || crmStats.pipelineValue || 0,
					totalLeads: leads.length,
					proTrials: crmStats.activeTrials || crmStats.proTrials || 0
				}
			});
		}
		if (pathname === "/api/admin/users" && method === "GET") return json({
			success: true,
			users: (await db.getAllUsers()).map((u) => ({
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
				createdAt: u.createdAt
			}))
		});
		if (pathname.startsWith("/api/admin/users/") && method === "PATCH") {
			const userId = pathname.replace("/api/admin/users/", "");
			const body = await parseBody();
			const updates = {};
			if (body.tier !== void 0) updates.tier = body.tier;
			if (body.isVerified !== void 0) updates.isVerified = body.isVerified;
			if (body.licenseActive !== void 0) updates.licenseActive = body.licenseActive;
			if (body.regenerateLicense) updates.licenseKey = db.generateLicenseKey();
			const updated = await db.updateUser(userId, updates);
			if (!updated) return json({ error: "User not found." }, 404);
			return json({
				success: true,
				user: updated
			});
		}
		if (pathname === "/api/admin/invite" && method === "POST") {
			const body = await parseBody();
			const email = body.email?.trim().toLowerCase();
			const name = body.name?.trim() || "Developer";
			const tier = body.tier || "pro";
			if (!email) return json({ error: "Email is required." }, 400);
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
						totalSeconds: tier === "enterprise" ? 36e4 : 72e3,
						usedSeconds: 0,
						periodReset: new Date(Date.now() + 2592e6).toISOString()
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				await db.createUser(user);
			} else await db.updateUser(user.id, {
				isVerified: true,
				licenseActive: true,
				tier
			});
			const mailRes = await mailer.sendInviteEmail(email, name, tier, licenseKey, url.origin);
			return json({
				success: true,
				message: `Invitation with ${tier.toUpperCase()} license sent to ${email}.`,
				licenseKey,
				messageId: mailRes.messageId
			});
		}
		if (pathname === "/api/admin/agent-audit" && method === "POST") {
			const { execFile } = await import("node:child_process");
			const path = await import("node:path");
			const fs = await import("node:fs");
			const scriptPath = path.resolve(process.cwd(), "scripts/vesper-validator-agent.mjs");
			const origin = url.origin || "http://localhost:8080";
			return new Promise((resolve) => {
				execFile("node", [scriptPath, origin], { timeout: 3e4 }, (error, stdout, stderr) => {
					const reportPath = path.resolve(process.cwd(), "reports/e2e-audit-report.json");
					let reportData = null;
					try {
						if (fs.existsSync(reportPath)) reportData = JSON.parse(fs.readFileSync(reportPath, "utf8"));
					} catch {}
					resolve(json({
						success: !error,
						exitCode: error ? error.code : 0,
						stdout,
						stderr,
						report: reportData
					}));
				});
			});
		}
		if (pathname === "/api/admin/agent-audit" && method === "GET") {
			const path = await import("node:path");
			const fs = await import("node:fs");
			const reportPath = path.resolve(process.cwd(), "reports/e2e-audit-report.json");
			if (fs.existsSync(reportPath)) return json({
				success: true,
				report: JSON.parse(fs.readFileSync(reportPath, "utf8"))
			});
			return json({
				success: false,
				message: "No report generated yet."
			}, 404);
		}
		if (pathname === "/api/telemetry/tokens" && method === "POST") {
			const body = await parseBody();
			let targetUser;
			if (body.userId) targetUser = await db.findUserById(body.userId);
			else if (body.licenseKey) targetUser = await db.findUserByLicenseKey(body.licenseKey);
			else targetUser = (await db.getAllUsers())[0];
			if (!targetUser) return json({ error: "User or valid license key required to record token telemetry." }, 404);
			const pTokens = body.promptTokens || 0;
			const cTokens = body.completionTokens || 0;
			const tTokens = body.totalTokens || pTokens + cTokens;
			return json({
				success: true,
				recorded: tTokens,
				tokenQuota: (await db.recordUserTokens(targetUser.id, {
					promptTokens: pTokens,
					completionTokens: cTokens,
					totalTokens: tTokens
				}))?.tokenQuota
			});
		}
		if (pathname === "/api/stripe/webhook" && method === "POST") {
			const body = await parseBody();
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
							totalSeconds: 72e3,
							usedSeconds: user.usageQuota?.usedSeconds || 0,
							periodReset: new Date(Date.now() + 2592e6).toISOString()
						},
						tokenQuota: {
							monthlyAllowance: 5e6,
							usedTokens: user.tokenQuota?.usedTokens || 0,
							promptTokens: user.tokenQuota?.promptTokens || 0,
							completionTokens: user.tokenQuota?.completionTokens || 0,
							periodReset: new Date(Date.now() + 2592e6).toISOString()
						}
					});
					mailer.sendWelcomeEmail(user.email, user.name, user.licenseKey, "pro", url.origin).catch(() => {});
					return json({
						success: true,
						upgraded: true,
						user: updated?.id
					});
				}
			}
			return json({ received: true });
		}
		return json({ error: `Endpoint ${method} ${pathname} not found.` }, 404);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		console.error("API error:", errorMsg);
		return json({
			error: "Internal Server Error",
			details: errorMsg
		}, 500);
	}
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-BX1Aty8s.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const apiResponse = await handleApiRequest(request);
		if (apiResponse) return apiResponse;
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
