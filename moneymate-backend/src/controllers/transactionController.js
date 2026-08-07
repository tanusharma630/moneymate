import Transaction from "../models/Transaction.js";

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const formatted = transactions.map((t) => ({
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

    return res.status(200).json(formatted);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const { merchant, category, categoryIcon, amount, type, date, rawDate, method, notes } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      merchant,
      category,
      categoryIcon: categoryIcon || "Wallet",
      amount: Number(amount),
      type,
      date: date || "Today",
      rawDate: rawDate || new Date().toISOString().split("T")[0],
      method: method || "UPI",
      notes: notes || "",
    });

    return res.status(201).json({
      id: transaction._id.toString(),
      _id: transaction._id.toString(),
      userId: transaction.userId.toString(),
      merchant: transaction.merchant,
      category: transaction.category,
      categoryIcon: transaction.categoryIcon,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      rawDate: transaction.rawDate,
      method: transaction.method,
      notes: transaction.notes,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id, userId: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const fields = ["merchant", "category", "categoryIcon", "amount", "type", "date", "rawDate", "method", "notes"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        transaction[field] = req.body[field];
      }
    });

    await transaction.save();

    return res.status(200).json({
      id: transaction._id.toString(),
      _id: transaction._id.toString(),
      userId: transaction.userId.toString(),
      merchant: transaction.merchant,
      category: transaction.category,
      categoryIcon: transaction.categoryIcon,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      rawDate: transaction.rawDate,
      method: transaction.method,
      notes: transaction.notes,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
