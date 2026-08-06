import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and check current user session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const activeUser = await authService.getCurrentUser();
        setUser(activeUser);
      } catch (err) {
        console.error("Failed to restore auth session:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = useCallback(async (email, password, rememberMe) => {
    setIsLoading(true);
    try {
      const { user: authUser } = await authService.login(email, password, rememberMe);
      setUser(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const { user: authUser } = await authService.signup(userData);
      setUser(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return authService.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    return authService.resetPassword(token, newPassword);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUserProfile = useCallback(async (updatedData) => {
    const updated = await authService.updateProfile(updatedData);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      forgotPassword,
      resetPassword,
      logout,
      updateUserProfile,
    }),
    [user, isLoading, login, signup, forgotPassword, resetPassword, logout, updateUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
