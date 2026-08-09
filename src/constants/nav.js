import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Target,
  HandCoins,
  FileBarChart,
  Settings,
} from "lucide-react";
import { ROUTES } from "./routes";

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} path
 * @property {import('lucide-react').LucideIcon} icon
 */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Income", path: ROUTES.INCOME, icon: Wallet },
  { label: "Expenses", path: ROUTES.EXPENSES, icon: Receipt },
  { label: "Budget", path: ROUTES.BUDGET, icon: PieChart },
  { label: "Savings Goals", path: ROUTES.GOALS, icon: Target },
  { label: "Borrow & Lend", path: ROUTES.BORROW_LEND, icon: HandCoins },
  { label: "Reports", path: ROUTES.REPORTS, icon: FileBarChart },
];

/** @type {NavItem} */
export const SETTINGS_NAV_ITEM = {
  label: "Settings",
  path: ROUTES.SETTINGS,
  icon: Settings,
};
