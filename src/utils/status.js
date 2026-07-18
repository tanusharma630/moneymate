/**
 * Derives a Good / Warning / Critical status from a percentage-spent value.
 * @param {number} pct - percentage of budget spent, 0-100+
 * @returns {"good"|"warning"|"critical"}
 */
export function getBudgetStatus(pct) {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "warning";
  return "good";
}

/**
 * Clamps a progress percentage to the 0-100 range for progress bars/rings.
 * @param {number} value
 * @param {number} target
 * @returns {number}
 */
export function getProgressPct(value, target) {
  if (!target) return 0;
  return Math.min(Math.round((value / target) * 100), 100);
}
