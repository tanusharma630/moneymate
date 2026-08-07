import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../controllers/savingsController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSavingsGoals).post(createSavingsGoal);
router.route("/:id").put(updateSavingsGoal).delete(deleteSavingsGoal);

export default router;
