import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query currently matches.
 * @param {string} query - e.g. "(min-width: 1024px)"
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    mediaQueryList.addEventListener("change", listener);
    setMatches(mediaQueryList.matches);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/** Convenience hook: true when viewport is below Tailwind's `lg` breakpoint (1024px). */
export function useIsMobile() {
  return !useMediaQuery("(min-width: 1024px)");
}
