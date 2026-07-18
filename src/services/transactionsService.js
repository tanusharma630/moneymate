import { apiClient } from "@/services/apiClient";
import { transactions as mockTransactions } from "@/data/transactionsData";

const USE_MOCK = true; // flip to false once the Express backend is live

/**
 * Fetches the user's transactions. Currently resolves mock data with a
 * simulated network delay; swap USE_MOCK to false to hit the real API
 * without touching any calling code (see hooks/useTransactionsQuery.js).
 * @returns {Promise<import('@/data/transactionsData').Transaction[]>}
 */
export async function fetchTransactions() {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTransactions;
  }
  const { data } = await apiClient.get("/transactions");
  return data;
}
