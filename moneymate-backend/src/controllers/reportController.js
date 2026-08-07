import Transaction from "../models/Transaction.js";

// @desc    Get reports filtered by month, category, or date range
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res, next) => {
  try {
    const { month, category, startDate, endDate, type } = req.query;
    const userId = req.user._id;

    const query = { userId };

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (type && type !== "all") {
      query.type = type;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    const filtered = transactions.filter((t) => {
      if (month && month !== "all" && month !== "All Time") {
        const dateStr = t.rawDate || t.date;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            const mNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            const mAbbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const txMonthName = mNames[d.getMonth()];
            const txMonthAbbr = mAbbrs[d.getMonth()];
            const monthLower = month.toLowerCase();
            const matchesMonth = monthLower.includes(txMonthName.toLowerCase()) || monthLower.includes(txMonthAbbr.toLowerCase());
            if (!matchesMonth) return false;
          }
        }
      }

      if (startDate || endDate) {
        const dateStr = t.rawDate || t.date;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            if (startDate && d < new Date(startDate)) return false;
            if (endDate && d > new Date(endDate)) return false;
          }
        }
      }

      return true;
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown = {};

    filtered.forEach((t) => {
      const amt = Math.abs(t.amount);
      if (t.type === "income") {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + amt;
      }
    });

    const categorySummary = Object.keys(categoryBreakdown).map((catName) => ({
      category: catName,
      amount: categoryBreakdown[catName],
      percentage: totalExpenses > 0 ? Math.round((categoryBreakdown[catName] / totalExpenses) * 100) : 0,
    }));

    return res.status(200).json({
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      transactionCount: filtered.length,
      categorySummary,
      transactions: filtered.map((t) => ({
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
      })),
    });
  } catch (error) {
    return next(error);
  }
};
