import { Router } from "express";

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "MoneyMate Backend Running",
  });
});

export default router;
