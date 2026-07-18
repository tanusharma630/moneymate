import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(undefined);

/**
 * App-wide UI state that doesn't belong to any single page: the selected
 * date-range label shown in the top bar, and the initial dashboard loading
 * flag consumed by the skeleton screens.
 */
export function AppProvider({ children }) {
  const [dateRangeLabel, setDateRangeLabel] = useState("July 2026");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const value = useMemo(
    () => ({
      dateRangeLabel,
      setDateRangeLabel,
      isInitialLoading,
      setIsInitialLoading,
    }),
    [dateRangeLabel, isInitialLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** @returns {{ dateRangeLabel: string, setDateRangeLabel: Function, isInitialLoading: boolean, setIsInitialLoading: Function }} */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}
