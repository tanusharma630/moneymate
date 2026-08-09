import mongoose from "mongoose";
import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Resolve Node.js DNS SRV record lookup issues (ECONNREFUSED) on Windows/local DNS
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  /* ignore fallback errors */
}

const DEMO_USER_ID = "650000000000000000000001";

async function seedDefaultUser() {
  try {
    const demoEmail = "anvi@example.com";
    const existing = await User.findOne({ email: demoEmail });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      await User.create({
        _id: DEMO_USER_ID,
        name: "Anvi Sharma",
        email: demoEmail,
        password: hashedPassword,
      });
      console.log(`👤 Seeded demo user: ${demoEmail} (password: password123)`);
    }
  } catch (err) {
    console.error("Failed to seed demo user:", err.message);
  }
}

let activeMongoServer = null;

/**
 * Connect to MongoDB Atlas cluster using Mongoose.
 * In production (NODE_ENV === 'production' or process.env.RENDER), MONGODB_URI is strictly required,
 * and failure to connect will fail the process cleanly without fallback.
 */
export async function connectDB() {
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER;
  const uri = process.env.MONGODB_URI;

  if (isProduction) {
    if (!uri) {
      console.error("❌ MONGODB_URI environment variable is missing in production.");
      throw new Error("Fatal DB Error: MONGODB_URI environment variable is required in production.");
    }
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
      await seedDefaultUser();
      return true;
    } catch (error) {
      console.error(`❌ MongoDB Atlas connection failed in production: ${error.message}`);
      throw new Error(`Fatal DB Error: Could not connect to MongoDB Atlas in production. ${error.message}`);
    }
  }

  // Development mode fallback
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
      await seedDefaultUser();
      return true;
    } catch (error) {
      console.error(`❌ Atlas connection failure in dev mode: ${error.message}`);
      console.log(`⚠️ Development mode detected: Falling back to Local MongoDB storage...`);
    }
  }

  try {
    const dbDir = path.resolve("./.data/db");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    } else {
      const lockFile = path.join(dbDir, "mongod.lock");
      if (fs.existsSync(lockFile)) {
        try {
          fs.unlinkSync(lockFile);
        } catch {
          /* ignore lock removal error */
        }
      }
    }

    if (activeMongoServer) {
      try {
        await activeMongoServer.stop();
      } catch {
        /* ignore */
      }
    }

    const { MongoMemoryServer } = await import("mongodb-memory-server");
    activeMongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbDir,
        storageEngine: "wiredTiger",
      },
    });

    const memoryUri = activeMongoServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Connected to Persistent Local Database: ${conn.connection.host}`);
    await seedDefaultUser();
    return true;
  } catch (memError) {
    console.error(`❌ Persistent Local MongoDB connection failed: ${memError.message}`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const tempServer = await MongoMemoryServer.create();
      const conn = await mongoose.connect(tempServer.getUri());
      console.log(`✅ Connected to In-Memory Fallback Database: ${conn.connection.host}`);
      await seedDefaultUser();
      return true;
    } catch {
      return false;
    }
  }
}
