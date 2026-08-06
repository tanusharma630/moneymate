import PageHeader from "@/components/common/PageHeader";
import BudgetSection from "@/components/dashboard/BudgetSection";
import BudgetVsActualChart from "@/components/charts/BudgetVsActualChart";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";
import { getProgressPct } from "@/utils/status";
import StatCard from "@/components/cards/StatCard";
import { Wallet, PiggyBank } from "lucide-react";

export default function BudgetPage() {
  const { budgetCategories, openBudgetModal } = useAppContext();
  const totalBudget = budgetCategories.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + (c.spent || 0), 0);
  const overallPct = getProgressPct(totalSpent, totalBudget);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Budget Planning"
        description="Track how much you've allocated against how much you've actually spent, by category."
        action={
          <Button variant="primary" size="sm" onClick={() => openBudgetModal()}>
            + Create Budget
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total allocated" value={totalBudget} icon={Wallet} />
        <StatCard label="Total spent" value={totalSpent} icon={PiggyBank} valueClassName="text-warning" />
        <StatCard label="Overall used" value={overallPct} icon={PiggyBank} format="percent" />
      </div>

      <BudgetVsActualChart />

      <BudgetSection />
    </div>
  );
}

