import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import SavingsGoal from "../models/SavingsGoal.js";

// @desc    Get complete dashboard summary for logged-in user
// @route   GET /api/dashboard
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [transactions, budgets, savingsGoals] = await Promise.all([
      Transaction.find({ userId }).sort({ createdAt: -1 }),
      Budget.find({ userId }).sort({ createdAt: -1 }),
      SavingsGoal.find({ userId }).sort({ createdAt: -1 }),
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
      const amount = Math.abs(t.amount);
      if (t.type === "income") {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }
    });

    const totalBalance = totalIncome - totalExpenses;
    const totalSavings = savingsGoals.reduce((sum, g) => sum + (g.saved || 0), 0);

    const summaryMetrics = {
      totalBalance: {
        value: totalBalance,
        changePct: 12.5,
        periodLabel: "vs last month",
        updatedLabel: "Updated just now",
      },
      monthlyIncome: {
        value: totalIncome,
        changePct: 8.2,
        periodLabel: "vs last month",
        updatedLabel: "Updated just now",
      },
      monthlyExpenses: {
        value: totalExpenses,
        changePct: -4.1,
        periodLabel: "vs last month",
        updatedLabel: "Updated just now",
      },
      savings: {
        value: totalSavings,
        changePct: 15.0,
        periodLabel: "vs last month",
        updatedLabel: "Updated just now",
      },
    };

    const formattedTransactions = transactions.map((t) => ({
      id: t._id.toString(),
      _id: t._id.toString(),
      userId: t.userId.toString(),
      merchant: t.merchant,
      category: t.category,
      categoryIcon: t.categoryIcon || "Wallet",
      amount: t.amount,
      type: t.type,
      date: t.date,
      rawDate: t.rawDate,
      method: t.method || "UPI",
      notes: t.notes || "",
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    const formattedBudgets = budgets.map((b) => ({
      id: b._id.toString(),
      _id: b._id.toString(),
      userId: b.userId.toString(),
      name: b.name,
      budget: b.budget,
      spent: b.spent,
      icon: b.icon || "ShoppingBag",
      tone: b.tone || "accent",
      month: b.month || "Jul",
      notes: b.notes || "",
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    const formattedSavings = savingsGoals.map((g) => ({
      id: g._id.toString(),
      _id: g._id.toString(),
      userId: g.userId.toString(),
      title: g.title,
      name: g.name || g.title,
      saved: g.saved,
      target: g.target,
      category: g.category || "General",
      icon: g.icon || "Target",
      targetDate: g.targetDate || "Dec 2026",
      priority: g.priority || "Medium",
      notes: g.notes || "",
      completed: g.completed,
      archived: g.archived,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));

    return res.status(200).json({
      summaryMetrics,
      transactions: formattedTransactions,
      recentTransactions: formattedTransactions.slice(0, 5),
      budgets: formattedBudgets,
      savingsGoals: formattedSavings,
    });
  } catch (error) {
    return next(error);
  }
};
