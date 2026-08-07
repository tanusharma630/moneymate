import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    saved: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      default: "General",
    },
    icon: {
      type: String,
      default: "Target",
    },
    targetDate: {
      type: String,
      default: "Dec 2026",
    },
    priority: {
      type: String,
      default: "Medium",
    },
    notes: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);

export default SavingsGoal;
