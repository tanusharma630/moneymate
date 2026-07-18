import axios from "axios";

/**
 * Shared Axios instance for the future Node/Express backend.
 * Base URL is read from an env var so it can point at localhost during
 * development and a real host in production without code changes.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches the JWT (once auth exists) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("moneymate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error normalization so callers can rely on `error.message`.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
