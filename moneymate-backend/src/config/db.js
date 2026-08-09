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
 * Falls back to Persistent Local MongoDB if Atlas connection fails (e.g. IP whitelist / network issue).
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
      await seedDefaultUser();
      return true;
    } catch (error) {
      console.error(`❌ Atlas connection failure: ${error.message}`);
      console.log(`ℹ️ Explanation: Your IP is not whitelisted on MongoDB Atlas Network Access.`);
      console.log(`⚠️ Switching to Persistent Local MongoDB Storage so your accounts & data are NEVER lost on restart/refresh...`);
    }
  }

  try {
    const dbDir = path.resolve("./.data/db");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    } else {
      // Remove leftover lock file if present from ungraceful shutdown
      const lockFile = path.join(dbDir, "mongod.lock");
      if (fs.existsSync(lockFile)) {
        try {
          fs.unlinkSync(lockFile);
        } catch {
          /* ignore lock removal error if file in use */
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
    // Fallback to in-memory non-persistent if path locking fails
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
