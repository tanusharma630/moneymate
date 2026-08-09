import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    status: "OK",
    message: "MoneyMate Backend Running",
    database: dbStatusMap[dbState] || "unknown",
  });
});

export default router;
