import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

/**
 * Flips `isInitialLoading` to false after a short simulated delay, so the
 * dashboard shows its skeleton state briefly on first mount. Real API-backed
 * pages should prefer their own useQuery's `isLoading` instead of this —
 * this hook exists purely for the shell-level entrance animation.
 * @param {number} [delay=650]
 */
export function useInitialLoad(delay = 650) {
  const { setIsInitialLoading } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
