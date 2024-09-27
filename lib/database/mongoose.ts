import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare a global object with the type specified inline, using ES2015 module syntax
const globalCached = global as typeof global & { mongoose: MongooseConnection };

let cached: MongooseConnection = globalCached.mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = globalCached.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "AI_imagibify",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};
