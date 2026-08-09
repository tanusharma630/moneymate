import { apiClient } from "@/services/apiClient";

export async function migrateLocalStorageData(payload) {
  const { data } = await apiClient.post("/data/migrate", payload);
  return data;
}
