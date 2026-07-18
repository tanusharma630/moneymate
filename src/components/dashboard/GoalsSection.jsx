import { Target } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import GoalCard from "@/components/cards/GoalCard";
import { savingsGoals } from "@/data/goalsData";

export default function GoalsSection() {
  if (savingsGoals.length === 0) {
    return (
      <Card className="xl:col-span-7">
        <SectionTitle title="Savings Goals" />
        <EmptyState
          icon={Target}
          title="No savings goals yet"
          subtitle="Set a target like a laptop or a trip and MoneyMate will track your progress automatically."
          actionLabel="Create a goal"
        />
      </Card>
    );
  }

  return (
    <Card className="xl:col-span-7">
      <SectionTitle
        title="Savings Goals"
        action={
          <button type="button" className="text-[11.5px] text-accent">
            + New goal
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {savingsGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </Card>
  );
}
