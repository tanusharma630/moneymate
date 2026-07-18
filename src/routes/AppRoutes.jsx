import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ROUTES } from "@/constants/routes";
import DashboardPage from "@/pages/Dashboard";
import IncomePage from "@/pages/Income";
import ExpensesPage from "@/pages/Expenses";
import BudgetPage from "@/pages/Budget";
import GoalsPage from "@/pages/Goals";
import BorrowLendPage from "@/pages/BorrowLend";
import ReportsPage from "@/pages/Reports";
import SettingsPage from "@/pages/Settings";

/**
 * All routes render inside the shared Layout (sidebar + navbar) via a
 * layout route, so the app shell never remounts while navigating.
 */
export default function AppRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}
