import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 up to `target` using an ease-out cubic curve.
 * Used by summary/stat cards for the "counting up" entrance effect.
 *
 * @param {number} target
 * @param {number} [duration=900] - animation duration in ms
 * @returns {number} the current animated value
 */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
