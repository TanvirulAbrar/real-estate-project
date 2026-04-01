import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "real_estate";

if (!MONGODB_URI && process.env.NODE_ENV !== "test") {
  console.warn(
    "[mongodb] MONGODB_URI is not set. API routes that use the database will fail until it is configured.",
  );
}

if (!process.env.MONGODB_DB_NAME && process.env.NODE_ENV !== "test") {
  console.warn(
    `[mongodb] MONGODB_DB_NAME not set, using default: "${MONGODB_DB_NAME}"`,
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV !== "production") {
  globalForMongoose.mongooseCache = cache;
}

/**
 * Cached connection for Next.js (avoids new connections on every hot reload).
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("Please add MONGODB_URI to your environment.");
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,

        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        retryReads: true,
        bufferCommands: false,
      })
      .catch((error) => {
        console.error("[mongodb] Connection failed:", error);

        cache.promise = null;
        throw error;
      });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
