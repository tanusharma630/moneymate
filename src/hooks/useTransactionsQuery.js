import { useAppContext } from "@/context/AppContext";

/**
 * Custom hook returning the transactions state from global context, mimicking
 * the React Query response design to ensure full interface compatibility.
 */
export function useTransactionsQuery() {
  const { transactions, isInitialLoading } = useAppContext();
  
  return {
    data: transactions,
    isLoading: isInitialLoading,
  };
}
