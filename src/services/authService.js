import { apiClient } from "./apiClient";

const USE_MOCK = true;
const TOKEN_KEY = "moneymate_token";
const USER_KEY = "moneymate_user";
const MOCK_USERS_KEY = "moneymate_users_db";

const DEFAULT_USER = {
  id: "u-default",
  name: "Anvi Sharma",
  email: "anvi@example.com",
  avatarUrl: null,
  initial: "AS",
  monthlySavingsTarget: 30000,
  currency: "INR",
  notifyBudgetAlerts: true,
  themePreference: "dark",
};

/** Get stored mock users database or initialize default */
function getMockUsers() {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  const defaultList = [
    {
      ...DEFAULT_USER,
      password: "Password123", // Mock unhashed password storage for local dev
    },
  ];
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultList));
  return defaultList;
}

/** Save mock users list */
function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

/** Extract initial from full name */
export function getMonogram(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password, rememberMe = true) {
    if (!USE_MOCK) {
      const response = await apiClient.post("/auth/login", { email, password, rememberMe });
      const { token, user } = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      storage.setItem(USER_KEY, JSON.stringify(user));
      return { user, token };
    }

    // Mock Login implementation
    await new Promise((res) => setTimeout(res, 400));
    const users = getMockUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;
    const mockToken = `jwt-mock-token-${Date.now()}`;
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(TOKEN_KEY, mockToken);
    storage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

    return { user: userWithoutPassword, token: mockToken };
  },

  /**
   * Register a new user
   */
  async signup({ name, email, password }) {
    if (!USE_MOCK) {
      const response = await apiClient.post("/auth/signup", { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { user, token };
    }

    // Mock Signup implementation
    await new Promise((res) => setTimeout(res, 500));
    const users = getMockUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists");
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password, // Pre-wired for hash on server
      avatarUrl: null,
      initial: getMonogram(name),
      monthlySavingsTarget: 30000,
      currency: "INR",
      notifyBudgetAlerts: true,
      themePreference: "dark",
    };

    users.push(newUser);
    saveMockUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    const mockToken = `jwt-mock-token-${Date.now()}`;

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

    return { user: userWithoutPassword, token: mockToken };
  },

  /**
   * Request password reset link
   */
  async forgotPassword(email) {
    if (!USE_MOCK) {
      return apiClient.post("/auth/forgot-password", { email });
    }

    await new Promise((res) => setTimeout(res, 400));
    const users = getMockUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) {
      throw new Error("No account found with this email address");
    }
    return { success: true, message: "Password reset instructions sent to your email" };
  },

  /**
   * Reset password with reset token
   */
  async resetPassword(token, newPassword) {
    if (!USE_MOCK) {
      return apiClient.post("/auth/reset-password", { token, newPassword });
    }

    await new Promise((res) => setTimeout(res, 400));
    return { success: true, message: "Password successfully updated. You can now log in." };
  },

  /**
   * Get current authenticated user session
   */
  async getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    if (!USE_MOCK) {
      const response = await apiClient.get("/auth/me");
      return response.data.user;
    }

    const stored = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  /**
   * Logout user and clear session tokens
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  /**
   * Update user profile settings
   */
  async updateProfile(updatedValues) {
    if (!USE_MOCK) {
      const response = await apiClient.put("/auth/profile", updatedValues);
      const updatedUser = response.data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }

    await new Promise((res) => setTimeout(res, 300));
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("No active user session");

    const updatedUser = {
      ...currentUser,
      ...updatedValues,
      initial: updatedValues.name ? getMonogram(updatedValues.name) : currentUser.initial,
    };

    // Update in mock DB
    const users = getMockUsers();
    const index = users.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      saveMockUsers(users);
    }

    const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(updatedUser));

    return updatedUser;
  },
};
