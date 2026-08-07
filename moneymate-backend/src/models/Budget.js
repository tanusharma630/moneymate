import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      default: 0,
    },
    spent: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "ShoppingBag",
    },
    tone: {
      type: String,
      default: "accent",
    },
    month: {
      type: String,
      default: "Jul",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
