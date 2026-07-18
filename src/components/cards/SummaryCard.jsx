import Card from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import Sparkline from "@/components/charts/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { THEME } from "@/constants/theme";

const TONE_COLOR = {
  accent: THEME.accent,
  success: THEME.success,
  danger: THEME.danger,
};

const TONE_SOFT_BG = {
  accent: "bg-accent-soft",
  success: "bg-success-soft",
  danger: "bg-danger-soft",
};

/**
 * The dashboard's summary metric card. `layout` picks between the three
 * visual treatments used across the summary row so each card can look
 * distinct while sharing one implementation:
 *  - "hero": tall gradient card with a full-width sparkline (Total Balance)
 *  - "spark": value + comparison on the left, small sparkline on the right
 *  - "ring": progress ring paired with the value (Savings)
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {import('lucide-react').LucideIcon} props.icon
 * @param {"accent"|"success"|"danger"} [props.tone="accent"]
 * @param {"hero"|"spark"|"ring"} [props.layout="spark"]
 * @param {number} props.value
 * @param {number} props.changePct
 * @param {string} props.comparisonLabel
 * @param {string} props.updatedLabel
 * @param {number[]} [props.sparklineData]
 * @param {number} [props.ringPct] - required when layout="ring"
 */
export default function SummaryCard({
  label,
  icon: Icon,
  tone = "accent",
  layout = "spark",
  value,
  changePct,
  comparisonLabel,
  updatedLabel,
  sparklineData,
  ringPct,
}) {
  const animatedValue = useCountUp(value);
  const color = TONE_COLOR[tone];
  const isPositive = changePct >= 0;

  return (
    <Card
      className={cn(
        layout === "hero" && "bg-gradient-to-br from-surface-raised to-surface"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-chip", TONE_SOFT_BG[tone])}>
          <Icon size={12} color={color} />
        </div>
      </div>

      {layout === "ring" ? (
        <div className="mt-3 flex items-center gap-3">
          <ProgressRing pct={ringPct} size={52} stroke={5} color={THEME.success} />
          <div>
            <div className="mono text-xl font-semibold tracking-tight text-text-primary">
              {formatCurrency(animatedValue)}
            </div>
            <span className="text-[11px] text-text-tertiary">{ringPct}% of monthly target</span>
          </div>
        </div>
      ) : layout === "hero" ? (
        <>
          <div className="mono mt-3.5 text-[27px] font-semibold tracking-tight text-text-primary">
            {formatCurrency(animatedValue)}
          </div>
          <TrendRow isPositive={isPositive} changePct={changePct} comparisonLabel={comparisonLabel} />
          {sparklineData && (
            <div className="-mx-1 mt-3">
              <Sparkline data={sparklineData} color={color} />
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="mono text-2xl font-semibold tracking-tight text-text-primary">
              {formatCurrency(animatedValue)}
            </div>
            <TrendRow isPositive={isPositive} changePct={changePct} comparisonLabel={comparisonLabel} />
          </div>
          {sparklineData && (
            <div className="w-16">
              <Sparkline data={sparklineData} color={color} />
            </div>
          )}
        </div>
      )}

      {layout === "ring" && (
        <TrendRow
          isPositive={isPositive}
          changePct={changePct}
          comparisonLabel={comparisonLabel}
          className="mt-3"
        />
      )}

      <div className="mt-2.5 text-[9.5px] text-text-tertiary">{updatedLabel}</div>
    </Card>
  );
}

function TrendRow({ isPositive, changePct, comparisonLabel, className }) {
  return (
    <div className={cn("mt-2 flex items-center gap-1", className)}>
      <span className={cn("mono text-[11.5px]", isPositive ? "text-success" : "text-danger")}>
        {formatPercent(changePct)}
      </span>
      <span className="text-[11px] text-text-tertiary">{comparisonLabel}</span>
    </div>
  );
}
