import SavingsGoal from "../models/SavingsGoal.js";

// @desc    Get all savings goals for logged-in user
// @route   GET /api/savings
// @access  Private
export const getSavingsGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const formatted = goals.map((g) => ({
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

    return res.status(200).json(formatted);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a savings goal
// @route   POST /api/savings
// @access  Private
export const createSavingsGoal = async (req, res, next) => {
  try {
    const { title, name, saved, target, category, icon, targetDate, priority, notes, completed, archived } = req.body;

    const goal = await SavingsGoal.create({
      userId: req.user._id,
      title: title || name,
      name: name || title,
      saved: Number(saved) || 0,
      target: Number(target) || 0,
      category: category || "General",
      icon: icon || "Target",
      targetDate: targetDate || "Dec 2026",
      priority: priority || "Medium",
      notes: notes || "",
      completed: !!completed,
      archived: !!archived,
    });

    return res.status(201).json({
      id: goal._id.toString(),
      _id: goal._id.toString(),
      userId: goal.userId.toString(),
      title: goal.title,
      name: goal.name,
      saved: goal.saved,
      target: goal.target,
      category: goal.category,
      icon: goal.icon,
      targetDate: goal.targetDate,
      priority: goal.priority,
      notes: goal.notes,
      completed: goal.completed,
      archived: goal.archived,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a savings goal (deposit, complete, archive, edit)
// @route   PUT /api/savings/:id
// @access  Private
export const updateSavingsGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await SavingsGoal.findOne({ _id: id, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: "Savings goal not found" });
    }

    const fields = [
      "title",
      "name",
      "saved",
      "target",
      "category",
      "icon",
      "targetDate",
      "priority",
      "notes",
      "completed",
      "archived",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        goal[field] = req.body[field];
      }
    });

    // Handle title / name synchronization
    if (req.body.title && !req.body.name) goal.name = req.body.title;
    if (req.body.name && !req.body.title) goal.title = req.body.name;

    await goal.save();

    return res.status(200).json({
      id: goal._id.toString(),
      _id: goal._id.toString(),
      userId: goal.userId.toString(),
      title: goal.title,
      name: goal.name,
      saved: goal.saved,
      target: goal.target,
      category: goal.category,
      icon: goal.icon,
      targetDate: goal.targetDate,
      priority: goal.priority,
      notes: goal.notes,
      completed: goal.completed,
      archived: goal.archived,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/savings/:id
// @access  Private
export const deleteSavingsGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await SavingsGoal.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: "Savings goal not found" });
    }

    return res.status(200).json({ success: true, message: "Savings goal deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
