import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { migrateData } from "../controllers/migrationController.js";

const router = express.Router();

router.use(protect);

router.post("/migrate", migrateData);

export default router;
