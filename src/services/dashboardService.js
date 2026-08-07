import { apiClient } from "@/services/apiClient";

export async function fetchDashboardSummary() {
  const { data } = await apiClient.get("/dashboard");
  return data;
}
