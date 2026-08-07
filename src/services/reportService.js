import { apiClient } from "@/services/apiClient";

export async function fetchReports(params = {}) {
  const { data } = await apiClient.get("/reports", { params });
  return data;
}
