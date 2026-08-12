import { Trophy, Plus } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/utils/formatters";
import { getProgressPct } from "@/utils/status";
import { cn } from "@/utils/cn";
import { THEME } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";

/**
 * @param {Object} props
 * @param {import('@/data/goalsData').SavingsGoal} props.goal
 */
export default function GoalCard({ goal }) {
  const { openGoalModal } = useAppContext();
  const titleName = goal.title || goal.name;
  const targetVal = goal.target || 1;
  const savedVal = goal.saved || 0;
  const pct = getProgressPct(savedVal, targetVal);
  const remaining = Math.max(0, targetVal - savedVal);
  const achieved = pct >= 80;
  const reached = pct >= 100;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-card border bg-surface-raised p-4 transition-transform duration-200 hover:-translate-y-0.5",
        achieved ? "border-success/30" : "border-border"
      )}
    >
      {achieved && (
        <span className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-success px-2 py-1 text-[9.5px] font-bold text-bg">
          <Trophy size={10} /> {reached ? "Goal reached!" : "Almost there"}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip bg-gradient-to-br from-accent-soft to-white/[0.02] text-lg">
            {goal.emoji || "🎯"}
          </div>
          <div>
            <div
              onClick={() => openGoalModal("edit", goal)}
              className="cursor-pointer text-[13px] font-medium text-text-primary hover:text-accent hover:underline"
            >
              {titleName}
            </div>
            <div className="text-[10.5px] text-text-tertiary">Est. completion {goal.targetDate || "Dec 2026"}</div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <ProgressRing pct={pct} size={44} stroke={4} color={achieved ? THEME.success : THEME.accent} />
          <span className="mono absolute text-[10px] font-semibold text-text-primary">{pct}%</span>
        </div>
      </div>

      <ProgressBar pct={pct} colorClassName={achieved ? "bg-success" : "bg-accent"} />

      <div className="flex items-end justify-between">
        <div>
          <div className="mono text-[16px] font-semibold text-text-primary">
            {formatCurrency(savedVal)}
          </div>
          <div className="text-[10.5px] text-text-tertiary">
            {formatCurrency(remaining)} remaining of {formatCurrency(targetVal)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => openGoalModal("deposit", goal)}
          className="flex items-center gap-1 rounded-chip border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent hover:bg-accent hover:text-white transition-colors"
        >
          <Plus size={12} /> Add funds
        </button>
      </div>
    </div>
  );
}
