import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import SavingsGoal from "../models/SavingsGoal.js";

// @desc    Get intelligent financial AI insights for logged-in user
// @route   GET /api/ai/insights
// @access  Private
export const getAIInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [transactions, budgets, savingsGoals] = await Promise.all([
      Transaction.find({ userId }).sort({ createdAt: -1 }),
      Budget.find({ userId }).sort({ createdAt: -1 }),
      SavingsGoal.find({ userId }).sort({ createdAt: -1 }),
    ]);

    // 1. Calculate Income & Expenses
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    transactions.forEach((t) => {
      const amt = Math.abs(t.amount || 0);
      if (t.type === "income") {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
        const cat = t.category || "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
      }
    });

    const monthlySavings = Math.max(0, totalIncome - totalExpenses);
    const savingsRate = totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0;

    // 2. Highest & Lowest Spending Categories
    const categoryEntries = Object.entries(categoryTotals);
    categoryEntries.sort((a, b) => b[1] - a[1]);

    const highestCategory = categoryEntries.length > 0 ? { name: categoryEntries[0][0], amount: categoryEntries[0][1] } : null;
    const lowestCategory = categoryEntries.length > 0 ? { name: categoryEntries[categoryEntries.length - 1][0], amount: categoryEntries[categoryEntries.length - 1][1] } : null;

    // 3. Budget Analysis
    let totalBudget = 0;
    let totalBudgetSpent = 0;
    const overbudgetCategories = [];

    budgets.forEach((b) => {
      totalBudget += b.budget || 0;
      totalBudgetSpent += b.spent || 0;
      if ((b.spent || 0) > (b.budget || 0) && (b.budget || 0) > 0) {
        overbudgetCategories.push({
          name: b.name,
          budget: b.budget,
          spent: b.spent,
          overAmount: b.spent - b.budget,
        });
      }
    });

    const budgetUtilizationPct = totalBudget > 0 ? Math.min(Math.round((totalBudgetSpent / totalBudget) * 100), 100) : 0;

    // 4. Savings Goals Progress
    const activeGoals = savingsGoals.filter((g) => !g.archived);
    const totalGoalSaved = activeGoals.reduce((s, g) => s + (g.saved || 0), 0);
    const totalGoalTarget = activeGoals.reduce((s, g) => s + (g.target || 0), 0);
    const overallGoalPct = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0;

    const closeToGoals = activeGoals.filter((g) => {
      const pct = (g.target || 0) > 0 ? (g.saved / g.target) * 100 : 0;
      return pct >= 70 && !g.completed;
    });

    // 5. Calculate Financial Health Score (0 - 100)
    // - Savings Rate (0-30 pts): 30% savings rate gives max 30 pts
    const savingsRateScore = Math.min(30, Math.max(0, (savingsRate / 30) * 30));

    // - Budget Discipline (0-30 pts): 30 pts minus 10 per overbudget category
    const budgetDisciplineScore = Math.max(0, 30 - overbudgetCategories.length * 10);

    // - Expense-to-Income Ratio (0-20 pts): lower expenses ratio gives higher pts
    const expRatio = totalIncome > 0 ? totalExpenses / totalIncome : 1;
    const expenseConsistencyScore = Math.max(0, Math.min(20, (1 - expRatio) * 20));

    // - Goal Progress (0-20 pts)
    const goalProgressScore = Math.min(20, (overallGoalPct / 100) * 20);

    const healthScore = Math.min(
      100,
      Math.max(0, Math.round(savingsRateScore + budgetDisciplineScore + expenseConsistencyScore + goalProgressScore))
    );

    let healthLabel = "Good";
    if (healthScore >= 90) healthLabel = "Excellent";
    else if (healthScore >= 70) healthLabel = "Good";
    else if (healthScore >= 50) healthLabel = "Needs Improvement";
    else healthLabel = "Poor";

    // 6. Risk Analysis Warnings
    const warnings = [];
    if (totalExpenses > totalIncome && totalIncome > 0) {
      warnings.push({
        id: "w-cashflow",
        title: "Negative Cash Flow Alert",
        text: `Your monthly expenses (₹${totalExpenses.toLocaleString()}) exceed your income (₹${totalIncome.toLocaleString()}).`,
        tone: "danger",
      });
    }

    if (overbudgetCategories.length > 0) {
      const catNames = overbudgetCategories.map((c) => c.name).join(", ");
      warnings.push({
        id: "w-budget",
        title: "Budget Limit Exceeded",
        text: `You have exceeded your budget in: ${catNames}.`,
        tone: "danger",
      });
    }

    if (savingsRate < 10 && totalIncome > 0) {
      warnings.push({
        id: "w-savings",
        title: "Low Savings Rate Warning",
        text: `Your savings rate is currently ${Math.round(savingsRate)}%. Aim to save at least 20% of your income.`,
        tone: "warning",
      });
    }

    // 7. Smart Suggestions & Recommendations
    const suggestions = [];
    if (monthlySavings > 0) {
      suggestions.push(`You saved ₹${monthlySavings.toLocaleString()} this month.`);
    }

    if (highestCategory && highestCategory.amount > 0) {
      const saving10 = Math.round(highestCategory.amount * 0.1);
      suggestions.push(
        `Reducing ${highestCategory.name} expenses by 10% could save approximately ₹${saving10.toLocaleString()} next month.`
      );
    }

    if (closeToGoals.length > 0) {
      suggestions.push(`You are close to achieving your "${closeToGoals[0].title || closeToGoals[0].name}" goal!`);
    }

    let recommendedAction = "Keep maintaining your current savings pace to hit your financial targets.";
    if (highestCategory && highestCategory.amount > 0) {
      const potSave = Math.round(highestCategory.amount * 0.15);
      recommendedAction = `Reduce ${highestCategory.name} spending by 15% to save ₹${potSave.toLocaleString()} next month.`;
    }

    // 8. End-of-month Predictions
    const today = new Date();
    const currentDay = today.getDate() || 1;
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() || 30;
    const dailySpendPace = totalExpenses / currentDay;
    const projectedMonthExpenses = Math.round(dailySpendPace * daysInMonth);
    const projectedSavings = Math.max(0, totalIncome - projectedMonthExpenses);
    const willExceedBudget = totalBudget > 0 && projectedMonthExpenses > totalBudget;
    const goalsAchievable = overallGoalPct >= 50 || projectedSavings > 5000;

    const todayInsight = `You're projected to save ₹${projectedSavings.toLocaleString()} this month with a ${Math.round(savingsRate)}% savings rate.`;
    const weeklyPrediction = willExceedBudget
      ? `Expense trend is pacing at ₹${projectedMonthExpenses.toLocaleString()}, which may exceed your monthly budget.`
      : `Expense pace is healthy at ₹${projectedMonthExpenses.toLocaleString()} estimated by month end.`;

    const responseData = {
      healthScore,
      healthLabel,
      metrics: {
        totalIncome,
        totalExpenses,
        monthlySavings,
        savingsRate: Math.round(savingsRate),
        budgetUtilizationPct,
        highestCategory,
        lowestCategory,
      },
      todayInsight,
      weeklyPrediction,
      recommendedAction,
      potentialSavings: highestCategory ? Math.round(highestCategory.amount * 0.15) : 1000,
      suggestions,
      warnings,
      predictions: {
        projectedMonthExpenses,
        projectedSavings,
        willExceedBudget,
        goalsAchievable,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    return next(error);
  }
};
