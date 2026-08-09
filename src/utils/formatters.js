/**
 * Formats a number as a whole-rupee currency string, e.g. 284650 -> "₹2,84,650".
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return `₹${formatted}`;
}

/**
 * Formats a plain number using Indian digit grouping, no currency symbol.
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(value)
  );
}

/**
 * Formats a signed percentage, e.g. 8.4 -> "+8.4%", -3.1 -> "-3.1%".
 * @param {number} value
 * @returns {string}
 */
export function formatPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Truncates axis-scale values for chart ticks, e.g. 92000 -> "92k".
 * @param {number} value
 * @returns {string}
 */
export function formatCompact(value) {
  if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
}
