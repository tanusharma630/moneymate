import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import savingsRoutes from "./routes/savingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import migrationRoutes from "./routes/migrationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration for frontend client
const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}


// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MoneyMate backend is running!",
  });
});


// ==========================================
// API ROUTES
// ==========================================

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/data", migrationRoutes);
app.use("/api/ai", aiRoutes);


// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

app.use(notFoundHandler);
app.use(errorHandler);

export default app;