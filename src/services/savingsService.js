import { apiClient } from "@/services/apiClient";

export async function fetchSavingsGoals() {
  const { data } = await apiClient.get("/savings");
  return data;
}

export async function createSavingsGoalApi(goalData) {
  const { data } = await apiClient.post("/savings", goalData);
  return data;
}

export async function updateSavingsGoalApi(id, goalData) {
  const { data } = await apiClient.put(`/savings/${id}`, goalData);
  return data;
}

export async function deleteSavingsGoalApi(id) {
  const { data } = await apiClient.delete(`/savings/${id}`);
  return data;
}
