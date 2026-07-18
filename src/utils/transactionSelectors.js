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
