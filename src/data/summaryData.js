/**
 * @typedef {Object} SummaryMetric
 * @property {number} value
 * @property {number} changePct
 * @property {string} comparisonLabel
 * @property {string} updatedLabel
 */

export const summaryMetrics = {
  totalBalance: {
    value: 284650,
    changePct: 8.4,
    comparisonLabel: "vs last month",
    updatedLabel: "Updated 4 minutes ago",
  },
  monthlyIncome: {
    value: 92000,
    changePct: 9.5,
    comparisonLabel: "from ₹84,000",
    updatedLabel: "Updated today, 9:05 AM",
  },
  monthlyExpenses: {
    value: 63500,
    changePct: 15.4,
    comparisonLabel: "from ₹55,000",
    updatedLabel: "Updated today, 1:20 PM",
  },
  savings: {
    value: 28500,
    changePct: 12.1,
    targetPct: 31,
    comparisonLabel: "vs last month",
    updatedLabel: "Updated 4 minutes ago",
  },
};
