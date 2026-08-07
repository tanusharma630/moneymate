import { apiClient } from "@/services/apiClient";

export async function fetchTransactions() {
  const { data } = await apiClient.get("/transactions");
  return data;
}

export async function createTransactionApi(txData) {
  const { data } = await apiClient.post("/transactions", txData);
  return data;
}

export async function updateTransactionApi(id, txData) {
  const { data } = await apiClient.put(`/transactions/${id}`, txData);
  return data;
}

export async function deleteTransactionApi(id) {
  const { data } = await apiClient.delete(`/transactions/${id}`);
  return data;
}
