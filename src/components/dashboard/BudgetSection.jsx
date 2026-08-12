import { PieChart } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import BudgetCard from "@/components/cards/BudgetCard";
import { useAppContext } from "@/context/AppContext";

export default function BudgetSection() {
  const { budgetCategories, dateRangeLabel, openBudgetModal } = useAppContext();

  if (budgetCategories.length === 0) {
    return (
      <Card>
        <SectionTitle title="Budget Planning" />
        <EmptyState
          icon={PieChart}
          title="No budgets set up yet"
          subtitle="Create a category budget to start tracking how much you spend against your plan."
          actionLabel="Create a budget"
          onAction={() => openBudgetModal()}
        />
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle
        title="Budget Planning"
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openBudgetModal()}
              className="text-[11.5px] font-medium text-accent hover:underline"
            >
              + New budget
            </button>
            <span className="text-[11.5px] text-text-tertiary">{dateRangeLabel}</span>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {budgetCategories.map((category) => (
          <BudgetCard key={category.id || category._id} category={category} />
        ))}
      </div>
    </Card>
  );
}
