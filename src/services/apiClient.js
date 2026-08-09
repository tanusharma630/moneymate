import axios from "axios";

const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  envUrl = envUrl.trim().replace(/\/+$/, "");
  if (!envUrl.endsWith("/api")) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches the JWT to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("moneymate_token") || sessionStorage.getItem("moneymate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error normalization & auto-clear stale tokens on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("moneymate_token");
      localStorage.removeItem("moneymate_user");
      sessionStorage.removeItem("moneymate_token");
      sessionStorage.removeItem("moneymate_user");
    }
    const message = error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
