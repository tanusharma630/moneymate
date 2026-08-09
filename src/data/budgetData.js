/**
 * @typedef {Object} BudgetCategory
 * @property {string} id
 * @property {string} name
 * @property {"UtensilsCrossed"|"Plane"|"Receipt"|"ShoppingBag"|"Clapperboard"} icon - lucide-react icon name
 * @property {"accent"|"success"|"warning"|"danger"} tone
 * @property {number} budget
 * @property {number} spent
 */

/** @type {BudgetCategory[]} */
export const budgetCategories = [
  { id: "food", name: "Food", icon: "UtensilsCrossed", tone: "warning", budget: 12000, spent: 9840 },
  { id: "travel", name: "Travel", icon: "Plane", tone: "accent", budget: 8000, spent: 3200 },
  { id: "bills", name: "Bills", icon: "Receipt", tone: "danger", budget: 15000, spent: 14100 },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", tone: "success", budget: 6000, spent: 2450 },
  { id: "entertainment", name: "Entertainment", icon: "Clapperboard", tone: "warning", budget: 4000, spent: 3680 },
];
