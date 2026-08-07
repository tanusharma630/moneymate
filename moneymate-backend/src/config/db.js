import mongoose from "mongoose";
import dns from "node:dns";
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

/**
 * Connect to MongoDB Atlas cluster using Mongoose.
 * Falls back to MongoDB Memory Server if Atlas connection fails (e.g. IP whitelist / network issue).
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
      await seedDefaultUser();
      return true;
    } catch (error) {
      console.error(`❌ Atlas connection failure: ${error.message}`);
      console.log(`⚠️ Attempting in-memory MongoDB fallback for local development...`);
    }
  }

  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Connected to In-Memory MongoDB: ${conn.connection.host}`);
    await seedDefaultUser();
    return true;
  } catch (memError) {
    console.error(`❌ In-Memory MongoDB connection failed: ${memError.message}`);
    return false;
  }
}
