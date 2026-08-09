import { apiClient } from "./apiClient";

const TOKEN_KEY = "moneymate_token";
const USER_KEY = "moneymate_user";

/** Extract initial from full name */
export function getMonogram(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Format raw user payload from backend to frontend format */
function normalizeUser(userData) {
  if (!userData) return null;
  return {
    id: userData.id || userData._id,
    name: userData.name || "",
    email: userData.email || "",
    initial: getMonogram(userData.name || ""),
    createdAt: userData.createdAt,
    avatarUrl: userData.avatarUrl || null,
    monthlySavingsTarget: userData.monthlySavingsTarget ?? 30000,
    currency: userData.currency || "INR",
    notifyBudgetAlerts: userData.notifyBudgetAlerts ?? true,
    themePreference: userData.themePreference || "dark",
  };
}

export const authService = {
  /**
   * Login user with email and password via backend API
   */
  async login(email, password, rememberMe = true) {
    const response = await apiClient.post("/auth/login", { email, password });
    const data = response.data;

    const token = data.token;
    const rawUser = data.user || { id: data.id, name: data.name, email: data.email };
    const user = normalizeUser(rawUser);

    const storage = rememberMe ? localStorage : sessionStorage;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  /**
   * Register a new user via backend API
   */
  async signup({ name, email, password }) {
    const response = await apiClient.post("/auth/register", { name, email, password });
    const data = response.data;

    const token = data.token;
    const rawUser = data.user || { id: data.id, name: data.name, email: data.email };
    const user = normalizeUser(rawUser);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  /**
   * Request password reset link
   */
  async forgotPassword(email) {
    return apiClient.post("/auth/forgot-password", { email });
  },

  /**
   * Reset password with reset token
   */
  async resetPassword(token, newPassword) {
    return apiClient.post("/auth/reset-password", { token, newPassword });
  },

  /**
   * Get current authenticated user session
   */
  async getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await apiClient.get("/auth/me");
      const user = normalizeUser(response.data.user);

      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      // Clear stale token and session user on error
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
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
    const response = await apiClient.put("/auth/profile", updatedValues);
    const updatedUser = normalizeUser(response.data.user);

    const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },
};
