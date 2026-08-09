/**
 * @typedef {Object} SavingsGoal
 * @property {string} id
 * @property {string} name
 * @property {"Laptop"|"Plane"} icon - lucide-react icon name
 * @property {string} emoji
 * @property {number} target
 * @property {number} saved
 * @property {string} targetDate
 * @property {number} daysLeft
 */

/** @type {SavingsGoal[]} */
export const savingsGoals = [
  {
    id: "laptop",
    name: "Laptop",
    icon: "Laptop",
    emoji: "💻",
    target: 90000,
    saved: 74500,
    targetDate: "Oct 12, 2026",
    daysLeft: 86,
  },
  {
    id: "goa-trip",
    name: "Goa Trip",
    icon: "Plane",
    emoji: "🏖️",
    target: 45000,
    saved: 39500,
    targetDate: "Sep 02, 2026",
    daysLeft: 55,
  },
];
