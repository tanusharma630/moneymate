import { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { transactions as initialTransactions } from "@/data/transactionsData";
import { budgetCategories as initialBudgetCategories } from "@/data/budgetData";
import { savingsGoals as initialSavingsGoals } from "@/data/goalsData";
import { borrowLendRecords as initialBorrowLendRecords } from "@/data/borrowLendData";
import { summaryMetrics as initialSummaryMetrics } from "@/data/summaryData";
import { TREND_BY_RANGE as initialTrendData, sparklines as initialSparklines } from "@/data/chartData";
import { profile as initialProfile, notifications as initialNotifications, coachInsight as initialCoachInsight } from "@/data/miscData";

const AppContext = createContext(undefined);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Global AppProvider implementing the finance state system, Quick Add modals,
 * and toast alert dispatchers.
 */
export function AppProvider({ children }) {
  const [dateRangeLabel, setDateRangeLabel] = useState("July 2026");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Auto-complete initial loading state shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Core Financial States (backed by localStorage)
  const [transactions, setTransactions] = useState(() => loadFromStorage("moneymate_transactions", initialTransactions));
  const [budgetCategories, setBudgetCategories] = useState(() => loadFromStorage("moneymate_budgetCategories", initialBudgetCategories));
  const [savingsGoals, setSavingsGoals] = useState(() => loadFromStorage("moneymate_savingsGoals", initialSavingsGoals));
  const [borrowLendRecords, setBorrowLendRecords] = useState(() => loadFromStorage("moneymate_borrowLendRecords", initialBorrowLendRecords));
  const [summaryMetrics, setSummaryMetrics] = useState(() => loadFromStorage("moneymate_summaryMetrics", initialSummaryMetrics));
  const [trendData, setTrendData] = useState(initialTrendData);
  const [sparklines, setSparklines] = useState(initialSparklines);
  const [profile, setProfile] = useState(() => loadFromStorage("moneymate_profile", initialProfile));
  const [notifications, setNotifications] = useState(initialNotifications);
  const [coachInsight] = useState(initialCoachInsight);

  // Persist financial states
  useEffect(() => {
    try { localStorage.setItem("moneymate_transactions", JSON.stringify(transactions)); } catch { /* noop */ }
  }, [transactions]);
  useEffect(() => {
    try { localStorage.setItem("moneymate_budgetCategories", JSON.stringify(budgetCategories)); } catch { /* noop */ }
  }, [budgetCategories]);
  useEffect(() => {
    try { localStorage.setItem("moneymate_savingsGoals", JSON.stringify(savingsGoals)); } catch { /* noop */ }
  }, [savingsGoals]);
  useEffect(() => {
    try { localStorage.setItem("moneymate_borrowLendRecords", JSON.stringify(borrowLendRecords)); } catch { /* noop */ }
  }, [borrowLendRecords]);
  useEffect(() => {
    try { localStorage.setItem("moneymate_summaryMetrics", JSON.stringify(summaryMetrics)); } catch { /* noop */ }
  }, [summaryMetrics]);
  useEffect(() => {
    try { localStorage.setItem("moneymate_profile", JSON.stringify(profile)); } catch { /* noop */ }
  }, [profile]);

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
  const [goalModalMode, setGoalModalMode] = useState("create"); // 'create' | 'deposit'

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
      try { localStorage.setItem("moneymate_theme", next); } catch { /* noop */ }
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

  // Count of unread notifications
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

  const addTransaction = useCallback((txData) => {
    const today = new Date();
    const dateObj = new Date(txData.date || today);
    
    const isToday = !isNaN(dateObj.getTime()) &&
                    dateObj.getFullYear() === today.getFullYear() &&
                    dateObj.getMonth() === today.getMonth() &&
                    dateObj.getDate() === today.getDate();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = !isNaN(dateObj.getTime()) &&
                        dateObj.getFullYear() === yesterday.getFullYear() &&
                        dateObj.getMonth() === yesterday.getMonth() &&
                        dateObj.getDate() === yesterday.getDate();

    const timeStr = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    let dateLabel = "";

    if (isToday) {
      dateLabel = `Today, ${timeStr}`;
    } else if (isYesterday) {
      dateLabel = "Yesterday";
    } else if (!isNaN(dateObj.getTime())) {
      const monthAbbr = MONTHS[dateObj.getMonth()];
      const dayStr = String(dateObj.getDate()).padStart(2, '0');
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

    const newTxObject = {
      id: `t-${Date.now()}`,
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

    setTransactions((prev) => [newTxObject, ...prev]);

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
            return {
              ...cat,
              spent: cat.spent + amountVal,
            };
          }
          return cat;
        });
      });
    }

    if (!isNaN(dateObj.getTime())) {
      const txMonth = MONTHS[dateObj.getMonth()];
      const txDay = DAYS[dateObj.getDay()];

      setTrendData((prev) => {
        const next = { ...prev };
        next.Week = next.Week.map((pt) => {
          if (pt.label === txDay) {
            return {
              ...pt,
              income: pt.income + (txData.type === "income" ? amountVal : 0),
              expenses: pt.expenses + (txData.type === "expense" ? amountVal : 0),
            };
          }
          return pt;
        });
        next.Month = next.Month.map((pt) => {
          if (pt.label === txMonth) {
            return {
              ...pt,
              income: pt.income + (txData.type === "income" ? amountVal : 0),
              expenses: pt.expenses + (txData.type === "expense" ? amountVal : 0),
            };
          }
          return pt;
        });
        next.Year = next.Year.map((pt) => {
          if (pt.label === txMonth) {
            return {
              ...pt,
              income: pt.income + (txData.type === "income" ? amountVal : 0),
              expenses: pt.expenses + (txData.type === "expense" ? amountVal : 0),
            };
          }
          return pt;
        });
        return next;
      });
    }

    setSparklines((prev) => {
      const next = { ...prev };
      const amountUnit = Math.round(amountVal / 1000) || 1;
      
      if (txData.type === "income") {
        const nextIncome = [...next.income];
        nextIncome[nextIncome.length - 1] += amountUnit;
        next.income = nextIncome;

        const nextBalance = [...next.balance];
        nextBalance[nextBalance.length - 1] += amountUnit;
        next.balance = nextBalance;
      } else {
        const nextExpenses = [...next.expenses];
        nextExpenses[nextExpenses.length - 1] += amountUnit;
        next.expenses = nextExpenses;

        const nextBalance = [...next.balance];
        nextBalance[nextBalance.length - 1] -= amountUnit;
        next.balance = nextBalance;
      }
      return next;
    });

    if (txData.type === "expense") {
      const matchedCategory = budgetCategories.find(c => c.name.toLowerCase() === txData.category.toLowerCase());
      if (matchedCategory && matchedCategory.budget > 0) {
        const nextSpent = matchedCategory.spent + amountVal;
        const limitPct = Math.round((nextSpent / matchedCategory.budget) * 100);
        if (limitPct >= 100) {
          setNotifications((prev) => [
            {
              id: `n-${Date.now()}`,
              text: `Overbudget Alert: Your ${matchedCategory.name} budget has exceeded 100% (${limitPct}% spent).`,
              time: "Just now",
              tone: "danger",
            },
            ...prev,
          ]);
          showToast(`Alert: ${matchedCategory.name} budget exceeded! (${limitPct}%)`, "warning");
        } else if (limitPct >= 80) {
          setNotifications((prev) => [
            {
              id: `n-${Date.now()}`,
              text: `Budget Alert: Your ${matchedCategory.name} budget has reached ${limitPct}%.`,
              time: "Just now",
              tone: "warning",
            },
            ...prev,
          ]);
          showToast(`${matchedCategory.name} budget is at ${limitPct}%`, "info");
        }
      }
    } else {
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          text: `${txData.description || "Payout"} of ₹${amountVal.toLocaleString()} received.`,
          time: "Just now",
          tone: "success",
        },
        ...prev
      ]);
    }

    showToast(`Successfully added ${txData.type} of ₹${amountVal.toLocaleString()}`, "success");
  }, [budgetCategories, showToast]);

  const editTransaction = useCallback((id, updatedTxData) => {
    setTransactions((prev) => {
      const existing = prev.find((t) => t.id === id);
      if (!existing) return prev;

      const oldAmount = Math.abs(existing.amount);
      const oldType = existing.type;
      const newAmount = Math.abs(Number(updatedTxData.amount) || 0);
      const newType = updatedTxData.type;

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
          prevCats.map((cat) =>
            cat.name.toLowerCase() === existing.category.toLowerCase()
              ? { ...cat, spent: Math.max(0, cat.spent - oldAmount) }
              : cat
          )
        );
      }
      if (newType === "expense") {
        setBudgetCategories((prevCats) =>
          prevCats.map((cat) =>
            cat.name.toLowerCase() === updatedTxData.category.toLowerCase()
              ? { ...cat, spent: cat.spent + newAmount }
              : cat
          )
        );
      }

      const today = new Date();
      const dateObj = new Date(updatedTxData.date || today);
      let dateLabel = existing.date;
      if (!isNaN(dateObj.getTime())) {
        const monthAbbr = MONTHS[dateObj.getMonth()];
        const dayStr = String(dateObj.getDate()).padStart(2, '0');
        dateLabel = `${monthAbbr} ${dayStr}`;
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
      const categoryIcon = categoryIcons[updatedTxData.category] || "Wallet";

      return prev.map((t) =>
        t.id === id
          ? {
              ...t,
              merchant: updatedTxData.description,
              category: updatedTxData.category,
              categoryIcon,
              amount: newType === "expense" ? -newAmount : newAmount,
              type: newType,
              date: dateLabel,
              rawDate: updatedTxData.date || t.rawDate,
              method: updatedTxData.method || "UPI",
              notes: updatedTxData.notes || "",
            }
          : t
      );
    });

    showToast("Transaction updated successfully", "success");
  }, [showToast]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => {
      const existing = prev.find((t) => t.id === id);
      if (!existing) return prev;

      const amountVal = Math.abs(existing.amount);
      const type = existing.type;

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
          prevCats.map((cat) =>
            cat.name.toLowerCase() === existing.category.toLowerCase()
              ? { ...cat, spent: Math.max(0, cat.spent - amountVal) }
              : cat
          )
        );
      }

      return prev.filter((t) => t.id !== id);
    });

    showToast("Transaction deleted successfully", "success");
  }, [showToast]);

  const duplicateTransaction = useCallback((id) => {
    const existing = transactions.find((t) => t.id === id);
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
  }, [transactions, addTransaction]);

  const updateProfile = useCallback((profileValues) => {
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
  }, [showToast]);

  // Report Filters state
  const [reportFilters, setReportFilters] = useState({
    selectedMonth: "",
    selectedYear: "",
    category: "all",
    type: "all",
  });

  // Derived computed stats across transactions, budgets, goals
  const derivedStats = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
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
  }, [transactions, budgetCategories, savingsGoals]);

  // Budget Actions
  const openBudgetModal = useCallback((category = null) => {
    setSelectedBudgetCategory(category);
    setIsBudgetModalOpen(true);
  }, []);

  const closeBudgetModal = useCallback(() => {
    setIsBudgetModalOpen(false);
    setSelectedBudgetCategory(null);
  }, []);

  const addBudgetCategory = useCallback((categoryData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      budget: Number(categoryData.budget) || 0,
      spent: 0,
      icon: categoryData.icon || "ShoppingBag",
      tone: categoryData.tone || "accent",
      month: categoryData.month || "Jul",
      notes: categoryData.notes || "",
    };
    setBudgetCategories((prev) => [...prev, newCategory]);
    showToast(`Budget for "${categoryData.name}" created`, "success");
  }, [showToast]);

  const editBudgetCategory = useCallback((id, categoryData) => {
    setBudgetCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: categoryData.name || c.name,
              budget: Number(categoryData.budget) || c.budget,
              icon: categoryData.icon || c.icon,
              tone: categoryData.tone || c.tone,
              month: categoryData.month || c.month,
              notes: categoryData.notes || c.notes,
            }
          : c
      )
    );
    showToast("Budget category updated successfully", "success");
  }, [showToast]);

  const deleteBudgetCategory = useCallback((id) => {
    setBudgetCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Budget category deleted", "success");
  }, [showToast]);

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

  const addSavingsGoal = useCallback((goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
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
    setSavingsGoals((prev) => [...prev, newGoal]);
    showToast(`Savings goal "${newGoal.title}" created`, "success");
  }, [showToast]);

  const depositToGoal = useCallback((id, depositAmount) => {
    const amount = Number(depositAmount) || 0;
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextSaved = g.saved + amount;
          const targetVal = g.target || 1;
          const prevPct = Math.floor((g.saved / targetVal) * 100);
          const nextPct = Math.floor((nextSaved / targetVal) * 100);
          const isComp = targetVal > 0 && nextSaved >= targetVal;

          const milestones = [25, 50, 75, 100];
          for (const m of milestones) {
            if (prevPct < m && nextPct >= m) {
              setNotifications((nPrev) => [
                {
                  id: `n-${Date.now()}-${m}`,
                  text: `Milestone Reached: Saved ${m}% for "${g.title || g.name}"! 🎉`,
                  time: "Just now",
                  tone: "success",
                },
                ...nPrev,
              ]);
              showToast(`Milestone! ${m}% saved for "${g.title || g.name}"`, "success");
            }
          }

          return { ...g, saved: nextSaved, completed: g.completed || isComp };
        }
        return g;
      })
    );
    setSummaryMetrics((prev) => ({
      ...prev,
      savings: {
        ...prev.savings,
        value: prev.savings.value + amount,
        updatedLabel: "Updated just now",
      },
    }));
    showToast(`Deposited ₹${amount.toLocaleString()} to savings goal`, "success");
  }, [showToast]);

  const toggleGoalCompleted = useCallback((id) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextState = !g.completed;
          showToast(`Goal marked as ${nextState ? "completed" : "active"}`, "success");
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  }, [showToast]);

  const archiveGoal = useCallback((id) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, archived: true } : g))
    );
    showToast("Savings goal archived", "success");
  }, [showToast]);

  const deleteGoal = useCallback((id) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    showToast("Savings goal removed", "success");
  }, [showToast]);

  // Borrow/Lend Actions
  const openBorrowLendModal = useCallback((record = null) => {
    setSelectedBorrowLendRecord(record);
    setIsBorrowLendModalOpen(true);
  }, []);

  const closeBorrowLendModal = useCallback(() => {
    setIsBorrowLendModalOpen(false);
    setSelectedBorrowLendRecord(null);
  }, []);

  const addBorrowLendRecord = useCallback((recordData) => {
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
  }, [showToast]);

  const toggleBorrowLendStatus = useCallback((id) => {
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
  }, [showToast]);

  const deleteBorrowLendRecord = useCallback((id) => {
    setBorrowLendRecords((prev) => prev.filter((r) => r.id !== id));
    showToast("Record deleted", "success");
  }, [showToast]);

  const value = useMemo(
    () => ({
      dateRangeLabel,
      setDateRangeLabel,
      isInitialLoading,
      setIsInitialLoading,

      // Financial State variables
      transactions,
      budgetCategories,
      savingsGoals,
      borrowLendRecords,
      summaryMetrics,
      trendData,
      sparklines,
      profile,
      notifications,
      coachInsight,
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
      budgetCategories,
      savingsGoals,
      borrowLendRecords,
      summaryMetrics,
      trendData,
      sparklines,
      profile,
      notifications,
      coachInsight,
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

/** @returns {{ dateRangeLabel: string, setDateRangeLabel: Function, isInitialLoading: boolean, setIsInitialLoading: Function, transactions: Array, budgetCategories: Array, savingsGoals: Array, borrowLendRecords: Array, summaryMetrics: Object, trendData: Object, sparklines: Object, profile: Object, notifications: Array, coachInsight: Object, derivedStats: Object, reportFilters: Object, setReportFilters: Function, isQuickAddOpen: boolean, quickAddType: string, openQuickAdd: Function, closeQuickAdd: Function, toast: Object, showToast: Function, addTransaction: Function, editTransaction: Function, deleteTransaction: Function, duplicateTransaction: Function, updateProfile: Function }} */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}

