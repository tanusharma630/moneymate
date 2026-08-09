/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} text
 * @property {string} time
 * @property {"success"|"warning"|"danger"} tone
 */

/** @type {Notification[]} */
export const notifications = [
  { id: "n-1", text: "Your Bills budget is at 94% — close to the limit.", time: "2h ago", tone: "warning" },
  { id: "n-2", text: "Freelance Payout of ₹18,000 received.", time: "5h ago", tone: "success" },
  { id: "n-3", text: "Priya Nair's repayment is overdue by 3 days.", time: "1d ago", tone: "danger" },
];

/**
 * @typedef {Object} CoachInsight
 * @property {number} healthScore
 * @property {string} todayInsight
 * @property {string} weeklyPrediction
 * @property {string} recommendedAction
 * @property {number} potentialSavings
 */

/** @type {CoachInsight} */
export const coachInsight = {
  healthScore: 78,
  todayInsight: "You're projected to save ₹18,450 this month.",
  weeklyPrediction:
    "Food spend is trending 18% above average and may exceed budget by ₹1,900 before month end.",
  recommendedAction: "Reduce Dining by ₹900 to hit your Laptop Goal 11 days sooner.",
  potentialSavings: 900,
};

export const profile = {
  name: "Anvi",
  initial: "A",
  monthSavings: 28500,
  savingsStreakDays: 12,
  monthProgressPct: 68,
};
