/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} merchant
 * @property {string} category
 * @property {"UtensilsCrossed"|"Wallet"|"Plane"|"ShoppingBag"|"Clapperboard"} categoryIcon - lucide-react icon name
 * @property {number} amount - positive for income, negative for expense
 * @property {"income"|"expense"} type
 * @property {string} date
 * @property {"UPI"|"Credit Card"|"Bank Transfer"} method
 */

/** @type {Transaction[]} */
export const transactions = [
  { id: "t-1", merchant: "Zomato", category: "Food", categoryIcon: "UtensilsCrossed", amount: -840, type: "expense", date: "Today, 1:20 PM", method: "UPI" },
  { id: "t-2", merchant: "Freelance Payout", category: "Income", categoryIcon: "Wallet", amount: 18000, type: "income", date: "Today, 9:05 AM", method: "Bank Transfer" },
  { id: "t-3", merchant: "IndiGo Airlines", category: "Travel", categoryIcon: "Plane", amount: -6200, type: "expense", date: "Yesterday", method: "Credit Card" },
  { id: "t-4", merchant: "Amazon", category: "Shopping", categoryIcon: "ShoppingBag", amount: -2199, type: "expense", date: "Yesterday", method: "Credit Card" },
  { id: "t-5", merchant: "Netflix", category: "Entertainment", categoryIcon: "Clapperboard", amount: -499, type: "expense", date: "Jul 15", method: "UPI" },
  { id: "t-6", merchant: "Salary", category: "Income", categoryIcon: "Wallet", amount: 72000, type: "income", date: "Jul 01", method: "Bank Transfer" },
];
