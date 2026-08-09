import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/utils/formatters";
import { useAppContext } from "@/context/AppContext";

/**
 * Compact profile card pinned to the bottom of the sidebar: avatar, name,
 * this month's savings, a savings streak, and month progress.
 * Reads from AppContext so settings updates reflect immediately.
 */
export default function ProfileSummaryCard() {
  const { profile } = useAppContext();

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface px-3 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-success text-xs font-semibold text-bg">
          {profile.initial}
        </div>
        <div className="min-w-0">
          <div className="text-[12.5px] font-medium text-text-primary">{profile.name}</div>
          <div className="mono text-[10.5px] text-success">
            +{formatCurrency(profile.monthSavings)} this month
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-0.5">
        <span className="text-xs">🔥</span>
        <span className="text-[10.5px] text-text-secondary">
          <span className="mono font-semibold text-warning">{profile.savingsStreakDays}-day</span>{" "}
          savings streak
        </span>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9.5px] text-text-tertiary">Month progress</span>
          <span className="mono text-[9.5px] text-text-secondary">{profile.monthProgressPct}%</span>
        </div>
        <ProgressBar pct={profile.monthProgressPct} />
      </div>
    </div>
  );
}
