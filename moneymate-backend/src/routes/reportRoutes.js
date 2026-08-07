import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getReports } from "../controllers/reportController.js";

const router = express.Router();

router.use(protect);

router.get("/", getReports);

export default router;
