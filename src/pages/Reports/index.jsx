import { useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import AnalyticsChart from "@/components/charts/AnalyticsChart";
import BudgetVsActualChart from "@/components/charts/BudgetVsActualChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import CoachCard from "@/components/cards/CoachCard";
import StatCard from "@/components/cards/StatCard";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";
import { filterTransactions, transactionsToCSV, downloadFile } from "@/utils/reportSelectors";
import { getUniqueCategories } from "@/utils/transactionSelectors";
import { Wallet, ArrowUpRight, ArrowDownRight, Download, Printer, Filter } from "lucide-react";

const MONTH_OPTIONS = [
  { value: "", label: "All Months" },
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

export default function ReportsPage() {
  const { transactions, reportFilters, setReportFilters, showToast } = useAppContext();

  const categories = useMemo(() => getUniqueCategories(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, reportFilters),
    [transactions, reportFilters]
  );

  const { income, expenses, net } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const t of filteredTransactions) {
      if (t.type === "income") inc += Math.abs(t.amount);
      else exp += Math.abs(t.amount);
    }
    return { income: inc, expenses: exp, net: inc - exp };
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    const csvContent = transactionsToCSV(filteredTransactions);
    const filename = `MoneyMate_Report_${new Date().toISOString().split("T")[0]}.csv`;
    downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
    showToast("Financial report downloaded as CSV", "success");
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Reports & Analytics"
        description="Detailed analytical insights, trends, and category breakdown of your finances."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrintPDF}>
              <Printer size={14} className="mr-1.5" /> Print PDF
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportCSV}>
              <Download size={14} className="mr-1.5" /> Export CSV
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface p-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Filter size={14} className="text-accent" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={reportFilters.selectedMonth}
            onChange={(e) => setReportFilters((prev) => ({ ...prev, selectedMonth: e.target.value }))}
            className="rounded-chip border border-border bg-surface-raised px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={reportFilters.category}
            onChange={(e) => setReportFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="rounded-chip border border-border bg-surface-raised px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={reportFilters.type}
            onChange={(e) => setReportFilters((prev) => ({ ...prev, type: e.target.value }))}
            className="rounded-chip border border-border bg-surface-raised px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>

          {(reportFilters.selectedMonth || reportFilters.category !== "all" || reportFilters.type !== "all") && (
            <button
              type="button"
              onClick={() => setReportFilters({ selectedMonth: "", selectedYear: "", category: "all", type: "all" })}
              className="text-[11px] font-medium text-accent hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Income (Filtered)" value={income} icon={ArrowUpRight} valueClassName="text-success" />
        <StatCard label="Expenses (Filtered)" value={expenses} icon={ArrowDownRight} valueClassName="text-danger" />
        <StatCard label="Net Cash Flow" value={net} icon={Wallet} />
      </div>

      {/* Primary Trend & Coach Insights */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <AnalyticsChart />
        <CoachCard />
      </div>

      {/* Budget vs Actual Comparison */}
      <BudgetVsActualChart />

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryPieChart transactions={filteredTransactions} />
        <CategoryBarChart transactions={filteredTransactions} />
      </div>
    </div>
  );
}
