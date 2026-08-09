import { apiClient } from "@/services/apiClient";

export async function fetchAIInsights() {
  const { data } = await apiClient.get("/ai/insights");
  return data;
}
