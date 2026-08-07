import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import SavingsGoal from "../models/SavingsGoal.js";

// @desc    Migrate localStorage data to MongoDB for logged-in user
// @route   POST /api/data/migrate
// @access  Private
export const migrateData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { transactions = [], budgetCategories = [], savingsGoals = [] } = req.body;

    const existingTxCount = await Transaction.countDocuments({ userId });
    const existingBudgetCount = await Budget.countDocuments({ userId });
    const existingGoalCount = await SavingsGoal.countDocuments({ userId });

    let migratedTxCount = 0;
    let migratedBudgetCount = 0;
    let migratedGoalCount = 0;

    // Migrate transactions if none in DB
    if (existingTxCount === 0 && Array.isArray(transactions) && transactions.length > 0) {
      const txDocs = transactions.map((t) => ({
        userId,
        merchant: t.merchant || t.description || "Unknown",
        category: t.category || "General",
        categoryIcon: t.categoryIcon || "Wallet",
        amount: Number(t.amount) || 0,
        type: t.type || (t.amount < 0 ? "expense" : "income"),
        date: t.date || "Today",
        rawDate: t.rawDate || new Date().toISOString().split("T")[0],
        method: t.method || "UPI",
        notes: t.notes || "",
      }));
      const inserted = await Transaction.insertMany(txDocs);
      migratedTxCount = inserted.length;
    }

    // Migrate budgets if none in DB
    if (existingBudgetCount === 0 && Array.isArray(budgetCategories) && budgetCategories.length > 0) {
      const budgetDocs = budgetCategories.map((b) => ({
        userId,
        name: b.name || "General",
        budget: Number(b.budget) || 0,
        spent: Number(b.spent) || 0,
        icon: b.icon || "ShoppingBag",
        tone: b.tone || "accent",
        month: b.month || "Jul",
        notes: b.notes || "",
      }));
      const inserted = await Budget.insertMany(budgetDocs);
      migratedBudgetCount = inserted.length;
    }

    // Migrate savings goals if none in DB
    if (existingGoalCount === 0 && Array.isArray(savingsGoals) && savingsGoals.length > 0) {
      const goalDocs = savingsGoals.map((g) => ({
        userId,
        title: g.title || g.name || "Goal",
        name: g.name || g.title || "Goal",
        saved: Number(g.saved) || 0,
        target: Number(g.target) || 0,
        category: g.category || "General",
        icon: g.icon || "Target",
        targetDate: g.targetDate || "Dec 2026",
        priority: g.priority || "Medium",
        notes: g.notes || "",
        completed: !!g.completed,
        archived: !!g.archived,
      }));
      const inserted = await SavingsGoal.insertMany(goalDocs);
      migratedGoalCount = inserted.length;
    }

    return res.status(200).json({
      success: true,
      message: "Data migration process completed",
      migrated: {
        transactions: migratedTxCount,
        budgets: migratedBudgetCount,
        savingsGoals: migratedGoalCount,
      },
    });
  } catch (error) {
    return next(error);
  }
};
