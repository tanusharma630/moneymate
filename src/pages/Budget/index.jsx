import PageHeader from "@/components/common/PageHeader";
import BudgetSection from "@/components/dashboard/BudgetSection";
import { budgetCategories } from "@/data/budgetData";
import { getProgressPct } from "@/utils/status";
import StatCard from "@/components/cards/StatCard";
import { Wallet, PiggyBank } from "lucide-react";

export default function BudgetPage() {
  const totalBudget = budgetCategories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const overallPct = getProgressPct(totalSpent, totalBudget);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Budget Planning"
        description="Track how much you've allocated against how much you've actually spent, by category."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total allocated" value={totalBudget} icon={Wallet} />
        <StatCard label="Total spent" value={totalSpent} icon={PiggyBank} valueClassName="text-warning" />
        <StatCard label="Overall used" value={overallPct} icon={PiggyBank} format="percent" />
      </div>

      <BudgetSection />
    </div>
  );
}
