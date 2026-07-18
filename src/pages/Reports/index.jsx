import PageHeader from "@/components/common/PageHeader";
import AnalyticsChart from "@/components/charts/AnalyticsChart";
import CoachCard from "@/components/cards/CoachCard";
import StatCard from "@/components/cards/StatCard";
import { summaryMetrics } from "@/data/summaryData";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function ReportsPage() {
  const net = summaryMetrics.monthlyIncome.value - summaryMetrics.monthlyExpenses.value;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Reports"
        description="A closer look at how your income and expenses are trending."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={summaryMetrics.monthlyIncome.value} icon={ArrowUpRight} valueClassName="text-success" />
        <StatCard label="Expenses" value={summaryMetrics.monthlyExpenses.value} icon={ArrowDownRight} valueClassName="text-danger" />
        <StatCard label="Net this month" value={net} icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <AnalyticsChart />
        <CoachCard />
      </div>
    </div>
  );
}
