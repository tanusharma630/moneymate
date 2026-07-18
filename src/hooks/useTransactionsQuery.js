import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/transactionsService";

/**
 * Query hook for the transactions list. This is the template every future
 * data hook (income, expenses, goals, borrow/lend) should follow once those
 * endpoints exist on the backend.
 */
export function useTransactionsQuery() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    staleTime: 60_000,
  });
}
