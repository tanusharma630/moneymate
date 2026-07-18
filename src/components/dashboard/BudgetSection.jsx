import { PieChart } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import BudgetCard from "@/components/cards/BudgetCard";
import { budgetCategories } from "@/data/budgetData";

export default function BudgetSection() {
  if (budgetCategories.length === 0) {
    return (
      <Card>
        <SectionTitle title="Budget Planning" />
        <EmptyState
          icon={PieChart}
          title="No budgets set up yet"
          subtitle="Create a category budget to start tracking how much you spend against your plan."
          actionLabel="Create a budget"
        />
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle
        title="Budget Planning"
        action={<span className="text-[11.5px] text-text-tertiary">July 2026</span>}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {budgetCategories.map((category) => (
          <BudgetCard key={category.id} category={category} />
        ))}
      </div>
    </Card>
  );
}
