import Budget from "../models/Budget.js";

// @desc    Get all budgets for logged-in user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const formatted = budgets.map((b) => ({
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

    return res.status(200).json(formatted);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a budget category
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { name, budget, spent, icon, tone, month, notes } = req.body;

    const newBudget = await Budget.create({
      userId: req.user._id,
      name,
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
      icon: icon || "ShoppingBag",
      tone: tone || "accent",
      month: month || "Jul",
      notes: notes || "",
    });

    return res.status(201).json({
      id: newBudget._id.toString(),
      _id: newBudget._id.toString(),
      userId: newBudget.userId.toString(),
      name: newBudget.name,
      budget: newBudget.budget,
      spent: newBudget.spent,
      icon: newBudget.icon,
      tone: newBudget.tone,
      month: newBudget.month,
      notes: newBudget.notes,
      createdAt: newBudget.createdAt,
      updatedAt: newBudget.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a budget category
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingBudget = await Budget.findOne({ _id: id, userId: req.user._id });

    if (!existingBudget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    const fields = ["name", "budget", "spent", "icon", "tone", "month", "notes"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        existingBudget[field] = req.body[field];
      }
    });

    await existingBudget.save();

    return res.status(200).json({
      id: existingBudget._id.toString(),
      _id: existingBudget._id.toString(),
      userId: existingBudget.userId.toString(),
      name: existingBudget.name,
      budget: existingBudget.budget,
      spent: existingBudget.spent,
      icon: existingBudget.icon,
      tone: existingBudget.tone,
      month: existingBudget.month,
      notes: existingBudget.notes,
      createdAt: existingBudget.createdAt,
      updatedAt: existingBudget.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a budget category
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingBudget = await Budget.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!existingBudget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    return res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
