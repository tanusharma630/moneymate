/**
 * @param {import('@/data/transactionsData').Transaction[]} transactions
 * @returns {import('@/data/transactionsData').Transaction[]}
 */
export function selectIncomeTransactions(transactions) {
  return transactions.filter((t) => t.type === "income");
}

/**
 * @param {import('@/data/transactionsData').Transaction[]} transactions
 * @returns {import('@/data/transactionsData').Transaction[]}
 */
export function selectExpenseTransactions(transactions) {
  return transactions.filter((t) => t.type === "expense");
}

/**
 * Sums the absolute amount of a list of transactions.
 * @param {import('@/data/transactionsData').Transaction[]} transactions
 * @returns {number}
 */
export function sumTransactions(transactions) {
  return transactions.reduce((total, t) => total + Math.abs(t.amount), 0);
}

/**
 * Sum income and expenses for a given month/year from rawDate field.
 * @param {import('@/data/transactionsData').Transaction[]} transactions
 * @param {number} month - 0-indexed
 * @param {number} year
 * @returns {{ income: number, expenses: number, net: number }}
 */
export function sumForMonth(transactions, month, year) {
  const filtered = transactions.filter((t) => {
    if (!t.rawDate) return false;
    const d = new Date(t.rawDate);
    return !isNaN(d.getTime()) && d.getMonth() === month && d.getFullYear() === year;
  });
  const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + Math.abs(t.amount), 0);
  const expenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  return { income, expenses, net: income - expenses };
}

/**
 * Get unique categories from transactions.
 * @param {import('@/data/transactionsData').Transaction[]} transactions
 * @returns {string[]}
 */
export function getUniqueCategories(transactions) {
  return [...new Set(transactions.map((t) => t.category).filter(Boolean))].sort();
}
