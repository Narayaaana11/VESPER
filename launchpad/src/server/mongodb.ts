import type { MongoClient, Db, Collection } from "mongodb";

const uri = process.env["MONGODB_URI"] || "";

const dbName = process.env["MONGODB_DB_NAME"] || "vesper";

interface MongoConnectionState {
  client: MongoClient | null;
  db: Db | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  lastPingMs: number | null;
}

// Preserve connection across HMR / SSR requests in dev
const globalForMongo = globalThis as unknown as {
  _mongoConnectionState?: MongoConnectionState;
};

const state: MongoConnectionState = globalForMongo._mongoConnectionState ?? {
  client: null,
  db: null,
  isConnected: false,
  isConnecting: false,
  lastError: null,
  lastPingMs: null,
};

globalForMongo._mongoConnectionState = state;

// Dynamically load MongoDB driver at runtime to prevent bundlers from tracing Node-only socket deps
async function getMongoDriver() {
  try {
    const pkgName = "mongodb";
    // @vite-ignore prevents Vite/Rolldown from statically packaging CJS socket dependencies into client or edge worker builds
    const mod = await import(/* @vite-ignore */ pkgName);
    return {
      MongoClient: mod.MongoClient,
      ServerApiVersion: mod.ServerApiVersion,
    };
  } catch (err) {
    console.warn("[MongoDB] Driver could not be loaded dynamically:", err);
    return null;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (state.db && state.isConnected) {
    return state.db;
  }

  if (state.isConnecting) {
    // Wait briefly for in-flight connection
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 100));
      if (state.isConnected && state.db) return state.db;
      if (!state.isConnecting) break;
    }
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

    const client: MongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
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
  } catch (err: unknown) {
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

export async function getMongoCollection<T extends Document | Record<string, unknown>>(
  collectionName: string,
): Promise<Collection<T> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<T>(collectionName);
}

export async function pingMongo(): Promise<{
  connected: boolean;
  latencyMs: number | null;
  error: string | null;
  dbName: string;
}> {
  if (!state.client || !state.isConnected) {
    // Attempt re-connection
    const db = await getMongoDb();
    if (!db) {
      return {
        connected: false,
        latencyMs: null,
        error: state.lastError || "Not connected to MongoDB",
        dbName,
      };
    }
  }

  try {
    const start = performance.now();
    await state.client!.db(dbName).command({ ping: 1 });
    const latencyMs = Math.round(performance.now() - start);
    state.lastPingMs = latencyMs;
    return {
      connected: true,
      latencyMs,
      error: null,
      dbName,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    state.isConnected = false;
    state.lastError = msg;
    return {
      connected: false,
      latencyMs: null,
      error: msg,
      dbName,
    };
  }
}

export function getMongoStatus() {
  return {
    isConnected: state.isConnected,
    lastPingMs: state.lastPingMs,
    lastError: state.lastError,
    dbName,
  };
}
