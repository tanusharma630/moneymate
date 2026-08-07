import { apiClient } from "@/services/apiClient";

export async function fetchBudgets() {
  const { data } = await apiClient.get("/budgets");
  return data;
}

export async function createBudgetApi(budgetData) {
  const { data } = await apiClient.post("/budgets", budgetData);
  return data;
}

export async function updateBudgetApi(id, budgetData) {
  const { data } = await apiClient.put(`/budgets/${id}`, budgetData);
  return data;
}

export async function deleteBudgetApi(id) {
  const { data } = await apiClient.delete(`/budgets/${id}`);
  return data;
}
