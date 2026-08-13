import { apiClient } from "@/services/apiClient";

export async function fetchAIInsights() {
  const { data } = await apiClient.get("/ai/insights");
  return data;
}

export async function applyAIRecommendationApi(payload) {
  const { data } = await apiClient.post("/ai/apply-recommendation", payload);
  return data;
}

