import { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactions as initialTransactions } from "@/data/transactionsData";
import { budgetCategories as initialBudgetCategories } from "@/data/budgetData";
import { savingsGoals as initialSavingsGoals } from "@/data/goalsData";
import { borrowLendRecords as initialBorrowLendRecords } from "@/data/borrowLendData";
import { summaryMetrics as initialSummaryMetrics } from "@/data/summaryData";
import { TREND_BY_RANGE as initialTrendData, sparklines as initialSparklines } from "@/data/chartData";
import { profile as initialProfile, notifications as initialNotifications, coachInsight as initialCoachInsight } from "@/data/miscData";

import { fetchTransactions, createTransactionApi, updateTransactionApi, deleteTransactionApi } from "@/services/transactionsService";
import { fetchBudgets, createBudgetApi, updateBudgetApi, deleteBudgetApi } from "@/services/budgetService";
import { fetchSavingsGoals, createSavingsGoalApi, updateSavingsGoalApi, deleteSavingsGoalApi } from "@/services/savingsService";
import { fetchDashboardSummary } from "@/services/dashboardService";
import { fetchAIInsights } from "@/services/aiService";
import { migrateLocalStorageData } from "@/services/migrationService";

const AppContext = createContext(undefined);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EMPTY_SUMMARY = {
  totalBalance: { value: 0, changePct: 0, periodLabel: "vs last month", updatedLabel: "Updated just now" },
  monthlyIncome: { value: 0, changePct: 0, periodLabel: "vs last month", updatedLabel: "Updated just now" },
  monthlyExpenses: { value: 0, changePct: 0, periodLabel: "vs last month", updatedLabel: "Updated just now" },
  savings: { value: 0, changePct: 0, periodLabel: "vs last month", updatedLabel: "Updated just now" },
};

/**
 * Global AppProvider implementing the finance state system, Quick Add modals,
 * AI Assistant, and toast alert dispatchers with MongoDB backend sync.
 */
export function AppProvider({ children }) {
  const { user } = useAuth();

  const [dateRangeLabel, setDateRangeLabel] = useState("All Time");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Auto-complete initial loading state shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Core Financial States
  const [transactions, setTransactions] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [borrowLendRecords, setBorrowLendRecords] = useState([]);
  const [summaryMetrics, setSummaryMetrics] = useState(EMPTY_SUMMARY);
  const [trendData, setTrendData] = useState(initialTrendData);
  const [sparklines, setSparklines] = useState(initialSparklines);
  const [profile, setProfile] = useState(initialProfile);
  const [notifications, setNotifications] = useState([]);
  const [coachInsight] = useState(initialCoachInsight);
  const [aiInsights, setAiInsights] = useState(null);

  const refreshAIInsights = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchAIInsights();
      if (data) {
        setAiInsights(data);
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  // Fetch data from MongoDB & perform one-time localStorage migration if present
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!user) {
        setTransactions([]);
        setBudgetCategories([]);
        setSavingsGoals([]);
        setBorrowLendRecords([]);
        setSummaryMetrics(EMPTY_SUMMARY);
        setProfile(initialProfile);
        setNotifications([]);
        setAiInsights(null);
        return;
      }

      // One-time legacy localStorage data migration check
      const storageKey = `moneymate_udata_${user.id}`;
      let localData = null;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          localData = JSON.parse(saved);
        }
      } catch {
        /* noop */
      }

      if (localData) {
        try {
          await migrateLocalStorageData({
            transactions: localData.transactions || [],
            budgetCategories: localData.budgetCategories || [],
            savingsGoals: localData.savingsGoals || [],
          });
        } catch {
          /* ignore migration error */
        }
        try {
          localStorage.removeItem(storageKey);
        } catch {
          /* noop */
        }
      }

      // Fetch live data from MongoDB
      try {
        const [dashData, txs, bdg, sav, aiData] = await Promise.all([
          fetchDashboardSummary().catch(() => null),
          fetchTransactions().catch(() => []),
          fetchBudgets().catch(() => []),
          fetchSavingsGoals().catch(() => []),
          fetchAIInsights().catch(() => null),
        ]);

        if (!isMounted) return;

        setTransactions(txs || []);
        setBudgetCategories(bdg || []);
        setSavingsGoals(sav || []);

        if (aiData) {
          setAiInsights(aiData);
        }

        if (dashData && dashData.summaryMetrics) {
          setSummaryMetrics(dashData.summaryMetrics);
        } else {
          const totalInc = (txs || []).filter((t) => t.type === "income").reduce((s, t) => s + Math.abs(t.amount), 0);
          const totalExp = (txs || []).filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
          const totalSav = (sav || []).reduce((s, g) => s + (g.saved || 0), 0);
          setSummaryMetrics({
            totalBalance: { value: totalInc - totalExp, changePct: 12.5, periodLabel: "vs last month", updatedLabel: "Updated just now" },
            monthlyIncome: { value: totalInc, changePct: 8.2, periodLabel: "vs last month", updatedLabel: "Updated just now" },
            monthlyExpenses: { value: totalExp, changePct: -4.1, periodLabel: "vs last month", updatedLabel: "Updated just now" },
            savings: { value: totalSav, changePct: 15.0, periodLabel: "vs last month", updatedLabel: "Updated just now" },
          });
        }

        setProfile({
          name: user.name || initialProfile.name,
          email: user.email || initialProfile.email,
          monthlySavingsTarget: 30000,
          currency: "INR",
          notifyBudgetAlerts: true,
        });
      } catch (err) {
        console.error("Failed to load user financial data from MongoDB:", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Interactive UI Modal & Toast States
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState("income");
  const [toast, setToast] = useState(null);

  // Budget Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(null);

  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalModalMode, setGoalModalMode] = useState("create");

  // Borrow/Lend Modal State
  const [isBorrowLendModalOpen, setIsBorrowLendModalOpen] = useState(false);
  const [selectedBorrowLendRecord, setSelectedBorrowLendRecord] = useState(null);

  // Global Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // Theme
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("moneymate_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("moneymate_theme", next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  // Apply theme class to <html>
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);

  // Notification read tracking
  const [readNotificationIds, setReadNotificationIds] = useState(new Set());

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readNotificationIds.has(n.id)).length,
    [notifications, readNotificationIds]
  );

  const markAllRead = useCallback(() => {
    setReadNotificationIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      return next;
    });
  }, [notifications]);

  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type, show: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const openQuickAdd = useCallback((type = "income") => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setIsQuickAddOpen(false);
  }, []);

  const addTransaction = useCallback(
    async (txData) => {
      const today = new Date();
      const dateObj = new Date(txData.date || today);

      const isToday =
        !isNaN(dateObj.getTime()) &&
        dateObj.getFullYear() === today.getFullYear() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getDate() === today.getDate();

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        !isNaN(dateObj.getTime()) &&
        dateObj.getFullYear() === yesterday.getFullYear() &&
        dateObj.getMonth() === yesterday.getMonth() &&
        dateObj.getDate() === yesterday.getDate();

      const timeStr = today.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      let dateLabel = "";

      if (isToday) {
        dateLabel = `Today, ${timeStr}`;
      } else if (isYesterday) {
        dateLabel = "Yesterday";
      } else if (!isNaN(dateObj.getTime())) {
        const monthAbbr = MONTHS[dateObj.getMonth()];
        const dayStr = String(dateObj.getDate()).padStart(2, "0");
        dateLabel = `${monthAbbr} ${dayStr}`;
      } else {
        dateLabel = txData.date || "Today";
      }

      const categoryIcons = {
        Food: "UtensilsCrossed",
        Travel: "Plane",
        Bills: "Receipt",
        Shopping: "ShoppingBag",
        Entertainment: "Clapperboard",
        Income: "Wallet",
        Freelance: "Wallet",
        Other: "Wallet",
      };
      const categoryIcon = categoryIcons[txData.category] || "Wallet";
      const amountVal = Math.abs(Number(txData.amount) || 0);
      const cleanAmount = txData.type === "expense" ? -amountVal : amountVal;

      const payload = {
        merchant: txData.description,
        category: txData.category,
        categoryIcon,
        amount: cleanAmount,
        type: txData.type,
        date: dateLabel,
        rawDate: txData.date || today.toISOString().split("T")[0],
        method: txData.method || "UPI",
        notes: txData.notes || "",
      };

      try {
        const createdTx = await createTransactionApi(payload);
        setTransactions((prev) => [createdTx, ...prev]);

        setSummaryMetrics((prev) => {
          const updated = { ...prev };
          if (txData.type === "income") {
            updated.totalBalance = {
              ...updated.totalBalance,
              value: updated.totalBalance.value + amountVal,
              updatedLabel: "Updated just now",
            };
            updated.monthlyIncome = {
              ...updated.monthlyIncome,
              value: updated.monthlyIncome.value + amountVal,
              updatedLabel: "Updated just now",
            };
          } else {
            updated.totalBalance = {
              ...updated.totalBalance,
              value: updated.totalBalance.value - amountVal,
              updatedLabel: "Updated just now",
            };
            updated.monthlyExpenses = {
              ...updated.monthlyExpenses,
              value: updated.monthlyExpenses.value + amountVal,
              updatedLabel: "Updated just now",
            };
          }
          return updated;
        });

        if (txData.type === "expense") {
          setBudgetCategories((prev) => {
            return prev.map((cat) => {
              if (cat.name.toLowerCase() === txData.category.toLowerCase()) {
                const nextSpent = cat.spent + amountVal;
                updateBudgetApi(cat.id || cat._id, { spent: nextSpent }).catch(() => {});
                return { ...cat, spent: nextSpent };
              }
              return cat;
            });
          });
        }

        showToast(`Successfully added ${txData.type} of ₹${amountVal.toLocaleString()}`, "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to save transaction: ${err.message}`, "danger");
      }
    },
    [showToast, refreshAIInsights]
  );

  const editTransaction = useCallback(
    async (id, updatedTxData) => {
      const existing = transactions.find((t) => t.id === id || t._id === id);
      const targetId = existing?.id || existing?._id || id;
      const oldAmount = existing ? Math.abs(existing.amount) : 0;
      const oldType = existing?.type || "expense";
      const newAmount = Math.abs(Number(updatedTxData.amount) || 0);
      const newType = updatedTxData.type;

      const categoryIcons = {
        Food: "UtensilsCrossed",
        Travel: "Plane",
        Bills: "Receipt",
        Shopping: "ShoppingBag",
        Entertainment: "Clapperboard",
        Income: "Wallet",
        Freelance: "Wallet",
        Other: "Wallet",
      };
      const categoryIcon = categoryIcons[updatedTxData.category] || "Wallet";

      const payload = {
        merchant: updatedTxData.description,
        category: updatedTxData.category,
        categoryIcon,
        amount: newType === "expense" ? -newAmount : newAmount,
        type: newType,
        rawDate: updatedTxData.date,
        method: updatedTxData.method || "UPI",
        notes: updatedTxData.notes || "",
      };

      try {
        const updatedTx = await updateTransactionApi(targetId, payload);

        setTransactions((prev) => prev.map((t) => (t.id === targetId || t._id === targetId ? updatedTx : t)));

        setSummaryMetrics((prevMetrics) => {
          const updated = { ...prevMetrics };
          if (oldType === "income") {
            updated.totalBalance = { ...updated.totalBalance, value: updated.totalBalance.value - oldAmount };
            updated.monthlyIncome = { ...updated.monthlyIncome, value: updated.monthlyIncome.value - oldAmount };
          } else {
            updated.totalBalance = { ...updated.totalBalance, value: updated.totalBalance.value + oldAmount };
            updated.monthlyExpenses = { ...updated.monthlyExpenses, value: updated.monthlyExpenses.value - oldAmount };
          }
          if (newType === "income") {
            updated.totalBalance = { ...updated.totalBalance, value: updated.totalBalance.value + newAmount };
            updated.monthlyIncome = { ...updated.monthlyIncome, value: updated.monthlyIncome.value + newAmount };
          } else {
            updated.totalBalance = { ...updated.totalBalance, value: updated.totalBalance.value - newAmount };
            updated.monthlyExpenses = { ...updated.monthlyExpenses, value: updated.monthlyExpenses.value + newAmount };
          }
          updated.totalBalance.updatedLabel = "Updated just now";
          return updated;
        });

        if (oldType === "expense") {
          setBudgetCategories((prevCats) =>
            prevCats.map((cat) => {
              if (cat.name.toLowerCase() === (existing?.category || "").toLowerCase()) {
                const nextSpent = Math.max(0, cat.spent - oldAmount);
                updateBudgetApi(cat.id || cat._id, { spent: nextSpent }).catch(() => {});
                return { ...cat, spent: nextSpent };
              }
              return cat;
            })
          );
        }
        if (newType === "expense") {
          setBudgetCategories((prevCats) =>
            prevCats.map((cat) => {
              if (cat.name.toLowerCase() === updatedTxData.category.toLowerCase()) {
                const nextSpent = cat.spent + newAmount;
                updateBudgetApi(cat.id || cat._id, { spent: nextSpent }).catch(() => {});
                return { ...cat, spent: nextSpent };
              }
              return cat;
            })
          );
        }

        showToast("Transaction updated successfully", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to update transaction: ${err.message}`, "danger");
      }
    },
    [transactions, showToast, refreshAIInsights]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      const existing = transactions.find((t) => t.id === id || t._id === id);
      const targetId = existing?.id || existing?._id || id;
      if (!existing) return;

      const amountVal = Math.abs(existing.amount);
      const type = existing.type;

      try {
        await deleteTransactionApi(targetId);

        setTransactions((prev) => prev.filter((t) => t.id !== targetId && t._id !== targetId));

        setSummaryMetrics((prevMetrics) => {
          const updated = { ...prevMetrics };
          if (type === "income") {
            updated.totalBalance = { ...updated.totalBalance, value: updated.totalBalance.value - amountVal };
            updated.monthlyIncome = { ...updated.monthlyIncome, value: updated.monthlyIncome.value - amountVal };
          } else {
            updated.totalBalance = { ...updated.totalBalance, value: updated.totalBalance.value + amountVal };
            updated.monthlyExpenses = { ...updated.monthlyExpenses, value: updated.monthlyExpenses.value - amountVal };
          }
          updated.totalBalance.updatedLabel = "Updated just now";
          return updated;
        });

        if (type === "expense") {
          setBudgetCategories((prevCats) =>
            prevCats.map((cat) => {
              if (cat.name.toLowerCase() === existing.category.toLowerCase()) {
                const nextSpent = Math.max(0, cat.spent - amountVal);
                updateBudgetApi(cat.id || cat._id, { spent: nextSpent }).catch(() => {});
                return { ...cat, spent: nextSpent };
              }
              return cat;
            })
          );
        }

        showToast("Transaction deleted successfully", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to delete transaction: ${err.message}`, "danger");
      }
    },
    [transactions, showToast, refreshAIInsights]
  );

  const duplicateTransaction = useCallback(
    (id) => {
      const existing = transactions.find((t) => t.id === id || t._id === id);
      if (!existing) return;

      addTransaction({
        type: existing.type,
        amount: Math.abs(existing.amount),
        category: existing.category,
        date: new Date().toISOString().split("T")[0],
        description: `${existing.merchant} (Copy)`,
        method: existing.method,
        notes: existing.notes || "",
      });
    },
    [transactions, addTransaction]
  );

  const updateProfile = useCallback(
    (profileValues) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          name: profileValues.name,
        };

        if (profileValues.monthlySavingsTarget) {
          updated.monthProgressPct = Math.round((prev.monthSavings / profileValues.monthlySavingsTarget) * 100);
        }
        return updated;
      });

      setSummaryMetrics((prev) => {
        const updated = { ...prev };
        if (profileValues.monthlySavingsTarget) {
          const savingsVal = updated.savings.value;
          const targetPct = Math.round((savingsVal / profileValues.monthlySavingsTarget) * 100);
          updated.savings = {
            ...updated.savings,
            targetPct,
          };
        }
        return updated;
      });

      showToast("Profile settings updated successfully!", "success");
    },
    [showToast]
  );

  // Report Filters state
  const [reportFilters, setReportFilters] = useState({
    selectedMonth: "",
    selectedYear: "",
    category: "all",
    type: "all",
  });

  // Month-filtered transactions based on dateRangeLabel selector
  const monthFilteredTransactions = useMemo(() => {
    if (!dateRangeLabel || dateRangeLabel === "All Time") {
      return transactions;
    }
    const labelParts = dateRangeLabel.trim().split(" ");
    const selectedMonthName = labelParts[0];
    const selectedYearStr = labelParts[1];

    return transactions.filter((t) => {
      const dateStr = t.rawDate || t.date;
      if (!dateStr) return true;
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const mAbbr = MONTHS[d.getMonth()];
        const fullMName = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][d.getMonth()];

        const monthMatches =
          selectedMonthName.toLowerCase().startsWith(mAbbr.toLowerCase()) ||
          fullMName.toLowerCase() === selectedMonthName.toLowerCase();

        const yearMatches = !selectedYearStr || d.getFullYear().toString() === selectedYearStr;
        return monthMatches && yearMatches;
      }
      return dateStr.toLowerCase().includes(selectedMonthName.toLowerCase());
    });
  }, [transactions, dateRangeLabel]);

  // Derived computed stats across transactions, budgets, goals
  const derivedStats = useMemo(() => {
    const totalIncome = monthFilteredTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalExpenses = monthFilteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const netCashFlow = totalIncome - totalExpenses;

    const totalBudget = budgetCategories.reduce((s, c) => s + (c.budget || 0), 0);
    const totalSpent = budgetCategories.reduce((s, c) => s + (c.spent || 0), 0);
    const overallBudgetPct = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;

    const activeGoals = savingsGoals.filter((g) => !g.archived);
    const totalGoalSaved = activeGoals.reduce((s, g) => s + (g.saved || 0), 0);
    const totalGoalTarget = activeGoals.reduce((s, g) => s + (g.target || 0), 0);
    const overallGoalPct = totalGoalTarget > 0 ? Math.min(Math.round((totalGoalSaved / totalGoalTarget) * 100), 100) : 0;

    return {
      totalIncome,
      totalExpenses,
      netCashFlow,
      totalBudget,
      totalSpent,
      overallBudgetPct,
      totalGoalSaved,
      totalGoalTarget,
      overallGoalPct,
    };
  }, [monthFilteredTransactions, budgetCategories, savingsGoals]);

  // Budget Actions
  const openBudgetModal = useCallback((category = null) => {
    setSelectedBudgetCategory(category);
    setIsBudgetModalOpen(true);
  }, []);

  const closeBudgetModal = useCallback(() => {
    setIsBudgetModalOpen(false);
    setSelectedBudgetCategory(null);
  }, []);

  const addBudgetCategory = useCallback(
    async (categoryData) => {
      const existingSpent = transactions
        .filter((t) => t.type === "expense" && t.category?.toLowerCase() === categoryData.name?.toLowerCase())
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const payload = {
        name: categoryData.name,
        budget: Number(categoryData.budget) || 0,
        spent: existingSpent,
        icon: categoryData.icon || "ShoppingBag",
        tone: categoryData.tone || "accent",
        month: categoryData.month || "Jul",
        notes: categoryData.notes || "",
      };
      try {
        const created = await createBudgetApi(payload);
        setBudgetCategories((prev) => [...prev, created]);
        showToast(`Budget for "${categoryData.name}" created`, "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to create budget: ${err.message}`, "danger");
      }
    },
    [transactions, showToast, refreshAIInsights]
  );

  const editBudgetCategory = useCallback(
    async (id, categoryData) => {
      const targetId = id;
      const payload = {
        name: categoryData.name,
        budget: Number(categoryData.budget) || 0,
        icon: categoryData.icon,
        tone: categoryData.tone,
        month: categoryData.month,
        notes: categoryData.notes,
      };
      try {
        const updated = await updateBudgetApi(targetId, payload);
        setBudgetCategories((prev) => prev.map((c) => (c.id === targetId || c._id === targetId ? updated : c)));
        showToast("Budget category updated successfully", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to update budget: ${err.message}`, "danger");
      }
    },
    [showToast, refreshAIInsights]
  );

  const deleteBudgetCategory = useCallback(
    async (id) => {
      try {
        await deleteBudgetApi(id);
        setBudgetCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        showToast("Budget category deleted", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to delete budget: ${err.message}`, "danger");
      }
    },
    [showToast, refreshAIInsights]
  );

  // Savings Goal Actions
  const openGoalModal = useCallback((mode = "create", goal = null) => {
    setGoalModalMode(mode);
    setSelectedGoal(goal);
    setIsGoalModalOpen(true);
  }, []);

  const closeGoalModal = useCallback(() => {
    setIsGoalModalOpen(false);
    setSelectedGoal(null);
    setGoalModalMode("create");
  }, []);

  const addSavingsGoal = useCallback(
    async (goalData) => {
      const payload = {
        title: goalData.title || goalData.name,
        name: goalData.title || goalData.name,
        saved: Number(goalData.saved) || 0,
        target: Number(goalData.target) || 0,
        category: goalData.category || "General",
        icon: goalData.icon || "Target",
        targetDate: goalData.targetDate || "Dec 2026",
        priority: goalData.priority || "Medium",
        notes: goalData.notes || "",
        completed: false,
        archived: false,
      };
      try {
        const created = await createSavingsGoalApi(payload);
        setSavingsGoals((prev) => [...prev, created]);
        showToast(`Savings goal "${created.title}" created`, "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to create savings goal: ${err.message}`, "danger");
      }
    },
    [showToast, refreshAIInsights]
  );

  const editSavingsGoal = useCallback(
    async (id, goalData) => {
      const targetId = id;
      const payload = {
        title: goalData.title || goalData.name,
        name: goalData.title || goalData.name,
        target: Number(goalData.target) || 0,
        saved: Number(goalData.saved) || 0,
        category: goalData.category || "General",
        icon: goalData.icon || "Target",
        targetDate: goalData.targetDate || "Dec 2026",
        priority: goalData.priority || "Medium",
        notes: goalData.notes || "",
      };
      try {
        const updated = await updateSavingsGoalApi(targetId, payload);
        setSavingsGoals((prev) => prev.map((g) => (g.id === targetId || g._id === targetId ? updated : g)));
        showToast("Savings goal updated successfully", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to update savings goal: ${err.message}`, "danger");
      }
    },
    [showToast, refreshAIInsights]
  );

  const depositToGoal = useCallback(
    async (id, depositAmount) => {
      const amount = Number(depositAmount) || 0;
      const existing = savingsGoals.find((g) => g.id === id || g._id === id);
      if (!existing) return;

      const targetId = existing.id || existing._id;
      const nextSaved = (existing.saved || 0) + amount;
      const targetVal = existing.target || 1;
      const isComp = targetVal > 0 && nextSaved >= targetVal;

      try {
        const updated = await updateSavingsGoalApi(targetId, { saved: nextSaved, completed: existing.completed || isComp });
        setSavingsGoals((prev) => prev.map((g) => (g.id === targetId || g._id === targetId ? updated : g)));
        setSummaryMetrics((prev) => ({
          ...prev,
          savings: {
            ...prev.savings,
            value: prev.savings.value + amount,
            updatedLabel: "Updated just now",
          },
        }));
        showToast(`Deposited ₹${amount.toLocaleString()} to savings goal`, "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to deposit to savings goal: ${err.message}`, "danger");
      }
    },
    [savingsGoals, showToast, refreshAIInsights]
  );

  const toggleGoalCompleted = useCallback(
    async (id) => {
      const existing = savingsGoals.find((g) => g.id === id || g._id === id);
      if (!existing) return;
      const targetId = existing.id || existing._id;
      const nextState = !existing.completed;
      try {
        const updated = await updateSavingsGoalApi(targetId, { completed: nextState });
        setSavingsGoals((prev) => prev.map((g) => (g.id === targetId || g._id === targetId ? updated : g)));
        showToast(`Goal marked as ${nextState ? "completed" : "active"}`, "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to update goal state: ${err.message}`, "danger");
      }
    },
    [savingsGoals, showToast, refreshAIInsights]
  );

  const archiveGoal = useCallback(
    async (id) => {
      const existing = savingsGoals.find((g) => g.id === id || g._id === id);
      const targetId = existing?.id || existing?._id || id;
      try {
        const updated = await updateSavingsGoalApi(targetId, { archived: true });
        setSavingsGoals((prev) => prev.map((g) => (g.id === targetId || g._id === targetId ? updated : g)));
        showToast("Savings goal archived", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to archive goal: ${err.message}`, "danger");
      }
    },
    [savingsGoals, showToast, refreshAIInsights]
  );

  const deleteGoal = useCallback(
    async (id) => {
      const existing = savingsGoals.find((g) => g.id === id || g._id === id);
      const targetId = existing?.id || existing?._id || id;
      try {
        await deleteSavingsGoalApi(targetId);
        setSavingsGoals((prev) => prev.filter((g) => g.id !== targetId && g._id !== targetId));
        showToast("Savings goal removed", "success");
        refreshAIInsights();
      } catch (err) {
        showToast(`Failed to remove goal: ${err.message}`, "danger");
      }
    },
    [savingsGoals, showToast, refreshAIInsights]
  );

  // Borrow/Lend Actions
  const openBorrowLendModal = useCallback((record = null) => {
    setSelectedBorrowLendRecord(record);
    setIsBorrowLendModalOpen(true);
  }, []);

  const closeBorrowLendModal = useCallback(() => {
    setIsBorrowLendModalOpen(false);
    setSelectedBorrowLendRecord(null);
  }, []);

  const addBorrowLendRecord = useCallback(
    (recordData) => {
      const newRecord = {
        id: `bl-${Date.now()}`,
        person: recordData.person,
        type: recordData.type || "lent",
        amount: Number(recordData.amount) || 0,
        dueDate: recordData.dueDate || "Next month",
        status: "pending",
        avatarUrl: recordData.avatarUrl || null,
        notes: recordData.notes || "",
      };
      setBorrowLendRecords((prev) => [newRecord, ...prev]);
      showToast(`Borrow/Lend record for ${recordData.person} created`, "success");
    },
    [showToast]
  );

  const toggleBorrowLendStatus = useCallback(
    (id) => {
      setBorrowLendRecords((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const nextStatus = r.status === "settled" ? "pending" : "settled";
            showToast(`Record status updated to ${nextStatus}`, "success");
            return { ...r, status: nextStatus };
          }
          return r;
        })
      );
    },
    [showToast]
  );

  const deleteBorrowLendRecord = useCallback(
    (id) => {
      setBorrowLendRecords((prev) => prev.filter((r) => r.id !== id));
      showToast("Record deleted", "success");
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      dateRangeLabel,
      setDateRangeLabel,
      isInitialLoading,
      setIsInitialLoading,

      // Financial State variables
      transactions: monthFilteredTransactions,
      allTransactions: transactions,
      monthFilteredTransactions,
      budgetCategories,
      savingsGoals,
      borrowLendRecords,
      summaryMetrics,
      trendData,
      sparklines,
      profile,
      notifications,
      coachInsight,
      aiInsights,
      refreshAIInsights,
      derivedStats,
      reportFilters,
      setReportFilters,

      // Modal & Toast Actions
      isQuickAddOpen,
      quickAddType,
      openQuickAdd,
      closeQuickAdd,
      toast,
      showToast,
      addTransaction,
      editTransaction,
      deleteTransaction,
      duplicateTransaction,
      updateProfile,

      // Budget Modal & Actions
      isBudgetModalOpen,
      selectedBudgetCategory,
      openBudgetModal,
      closeBudgetModal,
      addBudgetCategory,
      editBudgetCategory,
      deleteBudgetCategory,

      // Goal Modal & Actions
      isGoalModalOpen,
      selectedGoal,
      goalModalMode,
      openGoalModal,
      closeGoalModal,
      addSavingsGoal,
      editSavingsGoal,
      depositToGoal,
      toggleGoalCompleted,
      archiveGoal,
      deleteGoal,

      // BorrowLend Modal & Actions
      isBorrowLendModalOpen,
      selectedBorrowLendRecord,
      openBorrowLendModal,
      closeBorrowLendModal,
      addBorrowLendRecord,
      toggleBorrowLendStatus,
      deleteBorrowLendRecord,

      // Global Search
      isSearchOpen,
      openSearch,
      closeSearch,

      // Theme
      theme,
      toggleTheme,

      // Notifications
      unreadCount,
      readNotificationIds,
      markAllRead,
    }),
    [
      dateRangeLabel,
      isInitialLoading,
      transactions,
      monthFilteredTransactions,
      budgetCategories,
      savingsGoals,
      borrowLendRecords,
      summaryMetrics,
      trendData,
      sparklines,
      profile,
      notifications,
      coachInsight,
      aiInsights,
      refreshAIInsights,
      derivedStats,
      reportFilters,
      isQuickAddOpen,
      quickAddType,
      openQuickAdd,
      closeQuickAdd,
      toast,
      showToast,
      addTransaction,
      editTransaction,
      deleteTransaction,
      duplicateTransaction,
      updateProfile,
      isBudgetModalOpen,
      selectedBudgetCategory,
      openBudgetModal,
      closeBudgetModal,
      addBudgetCategory,
      editBudgetCategory,
      deleteBudgetCategory,
      isGoalModalOpen,
      selectedGoal,
      goalModalMode,
      openGoalModal,
      closeGoalModal,
      addSavingsGoal,
      editSavingsGoal,
      depositToGoal,
      toggleGoalCompleted,
      archiveGoal,
      deleteGoal,
      isBorrowLendModalOpen,
      selectedBorrowLendRecord,
      openBorrowLendModal,
      closeBorrowLendModal,
      addBorrowLendRecord,
      toggleBorrowLendStatus,
      deleteBorrowLendRecord,
      isSearchOpen,
      openSearch,
      closeSearch,
      theme,
      toggleTheme,
      unreadCount,
      readNotificationIds,
      markAllRead,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}
