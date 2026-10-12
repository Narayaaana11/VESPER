// Script to thoroughly clear MongoDB Atlas collections and keep only the root admin
import { MongoClient, ServerApiVersion } from "mongodb";
import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const uri = process.env["MONGODB_URI"];
const dbName = process.env["MONGODB_DB_NAME"] || "vesper";
const adminEmail = (process.env["ADMIN_EMAIL"] || "narayana@vesper.com").toLowerCase().trim();
const adminPassword = process.env["ADMIN_PASSWORD"] || "Narayana@11";

if (!uri) {
  console.error("Error: MONGODB_URI not found");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
  connectTimeoutMS: 8000,
  serverSelectionTimeoutMS: 8000,
});

async function main() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to MongoDB Atlas database: ${dbName}`);

    // 1. Clear leads
    const leadsCol = db.collection("leads");
    const leadsDel = await leadsCol.deleteMany({});
    console.log(`[LEADS] Deleted ${leadsDel.deletedCount} documents. (Count: 0)`);

    // 2. Clear feedback
    const feedbackCol = db.collection("feedback");
    const feedbackDel = await feedbackCol.deleteMany({});
    console.log(`[FEEDBACK] Deleted ${feedbackDel.deletedCount} documents. (Count: 0)`);

    // 3. Clear telemetry
    const telemetryCol = db.collection("telemetry");
    const telemetryDel = await telemetryCol.deleteMany({});
    console.log(`[TELEMETRY] Deleted ${telemetryDel.deletedCount} documents. (Count: 0)`);

    // 4. Ensure only the root administrator exists in users collection
    const usersCol = db.collection("users");
    const nonAdminDel = await usersCol.deleteMany({ email: { $ne: adminEmail } });
    console.log(`[USERS] Deleted ${nonAdminDel.deletedCount} non-admin accounts.`);

    const existingAdmin = await usersCol.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const rootAdmin = {
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
        createdAt: new Date().toISOString(),
      };
      await usersCol.insertOne(rootAdmin);
      console.log(`[USERS] Root admin created: ${adminEmail}`);
    } else {
      await usersCol.updateOne(
        { email: adminEmail },
        {
          $set: {
            passwordHash: adminPassword,
            role: "admin",
            isVerified: true,
            tier: "enterprise",
            licenseKey: "VESPER-ADMN-2026-ROOT",
            licenseActive: true,
          },
        }
      );
      console.log(`[USERS] Root admin verified and updated: ${adminEmail}`);
    }

    const finalUsers = await usersCol.find({}).toArray();
    const finalLeads = await leadsCol.countDocuments();
    const finalFeedback = await feedbackCol.countDocuments();
    const finalTelemetry = await telemetryCol.countDocuments();

    console.log("\n--- DATABASE SANITIZATION VERIFICATION ---");
    console.log(`Total Users: ${finalUsers.length} (${finalUsers[0]?.email})`);
    console.log(`Total Leads: ${finalLeads}`);
    console.log(`Total Feedback: ${finalFeedback}`);
    console.log(`Total Telemetry: ${finalTelemetry}`);
    console.log("-------------------------------------------\n");
  } catch (err) {
    console.error("DB clear error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
