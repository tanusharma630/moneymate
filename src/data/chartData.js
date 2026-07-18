/**
 * @typedef {Object} TrendPoint
 * @property {string} label
 * @property {number} income
 * @property {number} expenses
 */

/** @type {TrendPoint[]} */
export const weekTrend = [
  { label: "Mon", income: 2200, expenses: 1400 },
  { label: "Tue", income: 1800, expenses: 2100 },
  { label: "Wed", income: 3400, expenses: 1650 },
  { label: "Thu", income: 2100, expenses: 1900 },
  { label: "Fri", income: 4200, expenses: 2600 },
  { label: "Sat", income: 1600, expenses: 3100 },
  { label: "Sun", income: 900, expenses: 1200 },
];

/** @type {TrendPoint[]} */
export const monthTrend = [
  { label: "Feb", income: 78000, expenses: 52000 },
  { label: "Mar", income: 81000, expenses: 58000 },
  { label: "Apr", income: 79500, expenses: 49000 },
  { label: "May", income: 86000, expenses: 61000 },
  { label: "Jun", income: 84000, expenses: 55000 },
  { label: "Jul", income: 92000, expenses: 63500 },
];

/** @type {TrendPoint[]} */
export const yearTrend = [
  { label: "Aug", income: 71000, expenses: 48000 },
  { label: "Sep", income: 74500, expenses: 51000 },
  { label: "Oct", income: 76000, expenses: 53500 },
  { label: "Nov", income: 80500, expenses: 62000 },
  { label: "Dec", income: 94000, expenses: 71000 },
  { label: "Jan", income: 77000, expenses: 50500 },
  { label: "Feb", income: 78000, expenses: 52000 },
  { label: "Mar", income: 81000, expenses: 58000 },
  { label: "Apr", income: 79500, expenses: 49000 },
  { label: "May", income: 86000, expenses: 61000 },
  { label: "Jun", income: 84000, expenses: 55000 },
  { label: "Jul", income: 92000, expenses: 63500 },
];

export const TREND_BY_RANGE = {
  Week: weekTrend,
  Month: monthTrend,
  Year: yearTrend,
};

/** Tiny per-card sparkline series, decoupled from the main trend data. */
export const sparklines = {
  balance: [10, 14, 12, 18, 16, 22, 26],
  income: [5, 8, 6, 9, 12, 11, 15],
  expenses: [6, 5, 8, 6.5, 9, 8, 10.5],
};
