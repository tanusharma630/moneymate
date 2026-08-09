import { execSync } from "child_process";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/auth";

async function testAuth() {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "Password123!";
  const testName = "Test Auth User";

  console.log("--- 1. Testing POST /api/auth/register ---");
  try {
    const regRes = await axios.post(`${BASE_URL}/register`, {
      name: testName,
      email: testEmail,
      password: testPassword,
    });
    console.log("Register status:", regRes.status);
    console.log("Register response data:", regRes.data);
  } catch (err) {
    console.error("Register failed:", err.response?.status, err.response?.data || err.message);
  }

  console.log("\n--- 2. Testing POST /api/auth/register (Duplicate Email) ---");
  try {
    await axios.post(`${BASE_URL}/register`, {
      name: testName,
      email: testEmail,
      password: testPassword,
    });
  } catch (err) {
    console.log("Duplicate register error status:", err.response?.status);
    console.log("Duplicate register response message:", err.response?.data?.message);
  }

  console.log("\n--- 3. Testing POST /api/auth/login ---");
  let token = "";
  try {
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email: testEmail,
      password: testPassword,
    });
    console.log("Login status:", loginRes.status);
    console.log("Login response data:", loginRes.data);
    token = loginRes.data.token;
  } catch (err) {
    console.error("Login failed:", err.response?.status, err.response?.data || err.message);
  }

  console.log("\n--- 4. Testing GET /api/auth/me (Protected Route) ---");
  try {
    const meRes = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Protected /me status:", meRes.status);
    console.log("Protected /me user:", meRes.data);
  } catch (err) {
    console.error("Protected route failed:", err.response?.status, err.response?.data || err.message);
  }

  console.log("\n--- 5. Testing GET /api/auth/me without token ---");
  try {
    await axios.get(`${BASE_URL}/me`);
  } catch (err) {
    console.log("No token request status:", err.response?.status);
    console.log("No token error message:", err.response?.data?.message);
  }
}

testAuth();
