/**
 * Pure computation functions for MoneyMate analytics and reports.
 * All functions are side-effect free — they take state arrays and return derived data.
 * No hardcoded values; every number is computed from live transactions, budgets, and goals.
 */

/** @typedef {import('@/data/transactionsData').Transaction} Transaction */
/** @typedef {import('@/data/budgetData').BudgetCategory} BudgetCategory */
/** @typedef {import('@/data/goalsData').SavingsGoal} SavingsGoal */

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Transaction groupers ─────────────────────────────────────────────────────

/**
 * Sum income and expenses from a transaction list.
 * @param {Transaction[]} transactions
 * @returns {{ income: number, expenses: number, net: number }}
 */
export function sumIncomeExpenses(transactions) {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (t.type === "income") income += Math.abs(t.amount);
    else expenses += Math.abs(t.amount);
  }
  return { income, expenses, net: income - expenses };
}

/**
 * Group transactions by category. Returns array sorted by total descending.
 * @param {Transaction[]} transactions
 * @param {"income"|"expense"|"all"} [type="all"]
 * @returns {{ category: string, total: number, count: number }[]}
 */
export function groupByCategory(transactions, type = "all") {
  const filtered = type === "all" ? transactions : transactions.filter((t) => t.type === type);
  const map = {};
  for (const t of filtered) {
    const cat = t.category || "Other";
    if (!map[cat]) map[cat] = { category: cat, total: 0, count: 0 };
    map[cat].total += Math.abs(t.amount);
    map[cat].count += 1;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

/**
 * Build a 7-point weekly trend (last 7 calendar days from today).
 * @param {Transaction[]} transactions
 * @returns {{ label: string, income: number, expenses: number }[]}
 */
export function getWeeklyTrend(transactions) {
  const today = new Date();
  const points = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return { label: DAY_NAMES[d.getDay()], dateStr: d.toISOString().split("T")[0], income: 0, expenses: 0 };
  });

  for (const t of transactions) {
    const raw = t.rawDate;
    if (!raw) continue;
    const pt = points.find((p) => p.dateStr === raw);
    if (!pt) continue;
    if (t.type === "income") pt.income += Math.abs(t.amount);
    else pt.expenses += Math.abs(t.amount);
  }
  return points.map(({ label, income, expenses }) => ({ label, income, expenses }));
}

/**
 * Build a monthly trend using transaction `rawDate` fields.
 * Groups by month for the past N months (default 6).
 * @param {Transaction[]} transactions
 * @param {number} [months=6]
 * @returns {{ label: string, income: number, expenses: number }[]}
 */
export function getMonthlyTrend(transactions, months = 6) {
  const today = new Date();
  const points = Array.from({ length: months }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (months - 1 - i), 1);
    return {
      label: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
      income: 0,
      expenses: 0,
    };
  });

  for (const t of transactions) {
    const raw = t.rawDate;
    if (!raw) continue;
    const d = new Date(raw);
    if (isNaN(d.getTime())) continue;
    const pt = points.find((p) => p.year === d.getFullYear() && p.month === d.getMonth());
    if (!pt) continue;
    if (t.type === "income") pt.income += Math.abs(t.amount);
    else pt.expenses += Math.abs(t.amount);
  }
  return points.map(({ label, income, expenses }) => ({ label, income, expenses }));
}

/**
 * Build a 12-month yearly trend.
 * @param {Transaction[]} transactions
 * @returns {{ label: string, income: number, expenses: number }[]}
 */
export function getYearlyTrend(transactions) {
  return getMonthlyTrend(transactions, 12);
}

// ─── Budget selectors ─────────────────────────────────────────────────────────

/**
 * Compute budget vs actual for each category using live transaction data.
 * @param {Transaction[]} transactions
 * @param {BudgetCategory[]} budgetCategories
 * @returns {{ category: string, budget: number, spent: number, remaining: number, pct: number, tone: string }[]}
 */
export function getBudgetVsActual(transactions, budgetCategories) {
  return budgetCategories.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === "expense" && t.category?.toLowerCase() === cat.name?.toLowerCase())
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const pct = cat.budget > 0 ? Math.min(Math.round((spent / cat.budget) * 100), 150) : 0;
    return {
      category: cat.name,
      budget: cat.budget,
      spent,
      remaining: Math.max(0, cat.budget - spent),
      pct,
      tone: cat.tone || "accent",
    };
  });
}

/**
 * Total budget allocated and spent across all categories.
 * @param {BudgetCategory[]} budgetCategories
 * @returns {{ totalBudget: number, totalSpent: number, overallPct: number }}
 */
export function getBudgetSummary(budgetCategories) {
  const totalBudget = budgetCategories.reduce((s, c) => s + (c.budget || 0), 0);
  const totalSpent = budgetCategories.reduce((s, c) => s + (c.spent || 0), 0);
  const overallPct = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  return { totalBudget, totalSpent, overallPct };
}

// ─── Savings selectors ────────────────────────────────────────────────────────

/**
 * Compute savings totals and overall progress.
 * @param {SavingsGoal[]} savingsGoals
 * @returns {{ totalSaved: number, totalTarget: number, overallPct: number, activeCount: number, completedCount: number }}
 */
export function getSavingsSummary(savingsGoals) {
  const active = savingsGoals.filter((g) => !g.archived);
  const completed = savingsGoals.filter((g) => g.completed || (g.target > 0 && g.saved >= g.target));
  const totalSaved = active.reduce((s, g) => s + (g.saved || 0), 0);
  const totalTarget = active.reduce((s, g) => s + (g.target || 0), 0);
  const overallPct = totalTarget > 0 ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100) : 0;
  return { totalSaved, totalTarget, overallPct, activeCount: active.length, completedCount: completed.length };
}

/**
 * Estimate goal completion date in months from now.
 * @param {SavingsGoal} goal
 * @param {Transaction[]} transactions
 * @returns {string} Human readable estimate e.g. "~3 months"
 */
export function estimateGoalCompletion(goal, transactions) {
  const remaining = Math.max(0, (goal.target || 0) - (goal.saved || 0));
  if (remaining <= 0) return "Completed";
  // Average monthly deposit over last 3 months
  const recent = transactions.filter((t) => t.type === "income");
  const monthly = recent.length > 0
    ? recent.reduce((s, t) => s + Math.abs(t.amount), 0) / Math.max(1, recent.length / 30)
    : 0;
  if (monthly <= 0) return "—";
  const months = Math.ceil(remaining / monthly);
  if (months <= 1) return "< 1 month";
  if (months > 24) return "> 2 years";
  return `~${months} months`;
}

// ─── Filtering helpers ────────────────────────────────────────────────────────

/**
 * Filter transactions by date range, category, and type.
 * @param {Transaction[]} transactions
 * @param {{ selectedMonth?: number|"", selectedYear?: number|"", category?: string, type?: string }} filters
 * @returns {Transaction[]}
 */
export function filterTransactions(transactions, filters = {}) {
  const { selectedMonth, selectedYear, category, type } = filters;
  return transactions.filter((t) => {
    if (type && type !== "all" && t.type !== type) return false;
    if (category && category !== "all" && t.category?.toLowerCase() !== category.toLowerCase()) return false;
    if ((selectedMonth !== "" && selectedMonth !== undefined) || (selectedYear !== "" && selectedYear !== undefined)) {
      const raw = t.rawDate;
      if (!raw) return false;
      const d = new Date(raw);
      if (isNaN(d.getTime())) return false;
      if (selectedMonth !== "" && selectedMonth !== undefined && d.getMonth() !== Number(selectedMonth)) return false;
      if (selectedYear !== "" && selectedYear !== undefined && d.getFullYear() !== Number(selectedYear)) return false;
    }
    return true;
  });
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

/**
 * Convert transactions to a CSV string.
 * @param {Transaction[]} transactions
 * @returns {string}
 */
export function transactionsToCSV(transactions) {
  const headers = ["ID", "Type", "Description", "Category", "Amount", "Date", "Method"];
  const rows = transactions.map((t) => [
    t.id,
    t.type,
    `"${(t.merchant || t.description || "").replace(/"/g, '""')}"`,
    `"${t.category || ""}"`,
    t.amount,
    `"${t.rawDate || t.date || ""}"`,
    `"${t.method || ""}"`,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Download a string as a file.
 * @param {string} content
 * @param {string} filename
 * @param {string} [mimeType="text/csv"]
 */
export function downloadFile(content, filename, mimeType = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Category colour map (reused across charts) ───────────────────────────────
export const CATEGORY_COLORS = {
  Food: "#F0B65E",
  Travel: "#6E7BF2",
  Bills: "#FF6B7A",
  Shopping: "#3ED9A4",
  Entertainment: "#9C8CF9",
  Income: "#3ED9A4",
  Freelance: "#3ED9A4",
  Other: "#565D75",
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || "#6E7BF2";
}
