import { useState } from "react";
import { Target } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import GoalCard from "@/components/cards/GoalCard";
import { useAppContext } from "@/context/AppContext";

export default function GoalsSection() {
  const { savingsGoals, openGoalModal } = useAppContext();
  const [filter, setFilter] = useState("all");

  const filteredGoals = savingsGoals.filter((g) => {
    if (g.archived) return false;
    const isCompleted = g.completed || (g.target > 0 && g.saved >= g.target);
    if (filter === "active") return !isCompleted;
    if (filter === "completed") return isCompleted;
    return true;
  });

  if (savingsGoals.length === 0) {
    return (
      <Card className="xl:col-span-7">
        <SectionTitle title="Savings Goals" />
        <EmptyState
          icon={Target}
          title="No savings goals yet"
          subtitle="Set a target like a laptop or a trip and MoneyMate will track your progress automatically."
          actionLabel="Create a goal"
          onAction={() => openGoalModal("create")}
        />
      </Card>
    );
  }

  return (
    <Card className="xl:col-span-7">
      <SectionTitle
        title="Savings Goals"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-chip bg-surface p-0.5 text-[11px] font-medium border border-border">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-chip px-2 py-0.5 transition-colors ${
                  filter === "all" ? "bg-surface-raised text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                All ({savingsGoals.filter((g) => !g.archived).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={`rounded-chip px-2 py-0.5 transition-colors ${
                  filter === "active" ? "bg-surface-raised text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={`rounded-chip px-2 py-0.5 transition-colors ${
                  filter === "completed" ? "bg-surface-raised text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Completed
              </button>
            </div>
            <button
              type="button"
              onClick={() => openGoalModal("create")}
              className="text-[11.5px] font-medium text-accent hover:underline"
            >
              + New goal
            </button>
          </div>
        }
      />
      {filteredGoals.length === 0 ? (
        <div className="py-6 text-center text-[12.5px] text-text-tertiary">
          No goals found for "{filter}" filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </Card>
  );
}

