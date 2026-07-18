import { Clock, Trophy } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/utils/formatters";
import { getProgressPct } from "@/utils/status";
import { cn } from "@/utils/cn";
import { THEME } from "@/constants/theme";

/**
 * @param {Object} props
 * @param {import('@/data/goalsData').SavingsGoal} props.goal
 */
export default function GoalCard({ goal }) {
  const pct = getProgressPct(goal.saved, goal.target);
  const remaining = goal.target - goal.saved;
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
            {goal.emoji}
          </div>
          <div>
            <div className="text-[13px] font-medium text-text-primary">{goal.name}</div>
            <div className="text-[10.5px] text-text-tertiary">Est. completion {goal.targetDate}</div>
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
            {formatCurrency(goal.saved)}
          </div>
          <div className="text-[10.5px] text-text-tertiary">
            {formatCurrency(remaining)} remaining of {formatCurrency(goal.target)}
          </div>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <Clock size={11} />
          <span className="mono text-[11px]">{goal.daysLeft}d left</span>
        </div>
      </div>
    </div>
  );
}
