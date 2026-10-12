// Script to clear all users in MongoDB Atlas and initialize the root administrator
import { MongoClient, ServerApiVersion } from "mongodb";
import * as fs from "fs";
import * as path from "path";

// Read .env manually
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
  console.error("Error: MONGODB_URI not found in environment or .env");
  process.exit(1);
}

console.log(`Connecting to MongoDB Atlas cluster...`);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
  connectTimeoutMS: 8000,
  serverSelectionTimeoutMS: 8000,
});

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCol = db.collection("users");

    console.log("Connected to database:", dbName);

    // 1. Clear all existing users
    const deleteResult = await usersCol.deleteMany({});
    console.log(`[DELETE] Deleted ${deleteResult.deletedCount} existing users from 'users' collection.`);

    // 2. Create the requested Admin User
    const newAdminUser = {
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

    const insertResult = await usersCol.insertOne(newAdminUser);
    console.log(`[INSERT] Successfully inserted admin user: ${newAdminUser.email} (ID: ${insertResult.insertedId})`);

    // 3. Verify user list
    const remainingUsers = await usersCol.find({}).toArray();
    console.log("\n================ CURRENT USERS IN DATABASE ================");
    for (const u of remainingUsers) {
      console.log(`- Email: ${u.email} | Role: ${u.role} | Tier: ${u.tier} | License: ${u.licenseKey}`);
    }
    console.log("===========================================================\n");

    console.log("User reset complete!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
