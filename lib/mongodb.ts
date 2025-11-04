import mongoose from 'mongoose';

/**
 * MongoDB Connection URI
 * This should be stored in your .env.local file as MONGODB_URI
 */
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Validate that the MongoDB URI is present in environment variables
 */
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global type declaration for caching the mongoose connection
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Cached connection object
 * In development, Next.js hot reloads can create multiple connections
 * We cache the connection to prevent connection pool exhaustion
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and returns a cached MongoDB connection
 * 
 * @returns {Promise<mongoose.Connection>} The active MongoDB connection
 * 
 * How it works:
 * 1. If a connection already exists, return it immediately
 * 2. If a connection is being established, wait for that promise
 * 3. Otherwise, create a new connection and cache it
 */
async function connectDB(): Promise<mongoose.Connection> {
  // If we already have an active connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a connection promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering to fail fast if no connection
    };

    // Create connection promise and cache it
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Wait for the connection promise to resolve and cache the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear the promise so it can be retried
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
