import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";

/**
 * A minimal single-metric card for pages that don't need the full
 * SummaryCard treatment (sparkline, ring, etc) — e.g. quick totals on the
 * Income, Expenses, Budget, or Reports pages.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {number} props.value
 * @param {import('lucide-react').LucideIcon} [props.icon]
 * @param {"currency"|"percent"} [props.format="currency"]
 * @param {string} [props.valueClassName]
 */
export default function StatCard({ label, value, icon: Icon, format = "currency", valueClassName }) {
  const displayValue = format === "percent" ? `${value}%` : formatCurrency(value);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        {Icon && <Icon size={14} className="text-text-tertiary" />}
      </div>
      <div className={cn("mono mt-3 text-2xl font-semibold tracking-tight text-text-primary", valueClassName)}>
        {displayValue}
      </div>
    </Card>
  );
}
