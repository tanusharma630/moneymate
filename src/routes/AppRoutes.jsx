import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import { ROUTES } from "@/constants/routes";

import DashboardPage from "@/pages/Dashboard";
import IncomePage from "@/pages/Income";
import ExpensesPage from "@/pages/Expenses";
import BudgetPage from "@/pages/Budget";
import GoalsPage from "@/pages/Goals";
import BorrowLendPage from "@/pages/BorrowLend";
import ReportsPage from "@/pages/Reports";
import SettingsPage from "@/pages/Settings";

import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.INCOME} element={<IncomePage />} />
          <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
          <Route path={ROUTES.BUDGET} element={<BudgetPage />} />
          <Route path={ROUTES.GOALS} element={<GoalsPage />} />
          <Route path={ROUTES.BORROW_LEND} element={<BorrowLendPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

