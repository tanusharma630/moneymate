import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { resolveIcon } from "@/utils/iconMap";
import { formatCurrency } from "@/utils/formatters";
import { getBudgetStatus, getProgressPct } from "@/utils/status";
import { useAppContext } from "@/context/AppContext";

const TONE_ICON_BG = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

const TONE_BAR = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const TONE_TEXT = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const STATUS_TONE = {
  good: "success",
  warning: "warning",
  critical: "danger",
};

const STATUS_LABEL = {
  good: "Good",
  warning: "Warning",
  critical: "Critical",
};

/**
 * @param {Object} props
 * @param {import('@/data/budgetData').BudgetCategory} props.category
 */
export default function BudgetCard({ category }) {
  const { openBudgetModal } = useAppContext();
  const Icon = resolveIcon(category.icon);
  const pct = getProgressPct(category.spent, category.budget);
  const remaining = category.budget - category.spent;
  const status = getBudgetStatus(pct);

  return (
    <div
      onClick={() => openBudgetModal(category)}
      className="cursor-pointer rounded-card border border-border bg-surface-raised p-3.5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-7 w-7 items-center justify-center rounded-chip ${TONE_ICON_BG[category.tone]}`}>
          <Icon size={13} />
        </div>
        <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
      </div>

      <div className="text-[12.5px] font-medium text-text-primary">{category.name}</div>
      <div className="mono mt-1.5 text-[15px] font-semibold text-text-primary">
        {formatCurrency(category.spent)}
      </div>
      <div className="mb-2 text-[10.5px] text-text-tertiary">
        of {formatCurrency(category.budget)}
      </div>

      <ProgressBar pct={pct} colorClassName={TONE_BAR[category.tone]} />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-text-tertiary">{formatCurrency(remaining)} left</span>
        <span className={`mono text-[10.5px] font-semibold ${TONE_TEXT[category.tone]}`}>{pct}%</span>
      </div>
    </div>
  );
}
