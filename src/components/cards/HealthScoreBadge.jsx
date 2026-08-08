import ProgressRing from "@/components/ui/ProgressRing";

/**
 * @param {Object} props
 * @param {number} props.score - 0-100
 * @param {string} [props.label]
 */
export default function HealthScoreBadge({ score = 75, label: customLabel }) {
  let tone = "#22c55e";
  let label = "Excellent";

  if (score >= 90) {
    tone = "#22c55e";
    label = "Excellent";
  } else if (score >= 70) {
    tone = "#3b82f6";
    label = "Good";
  } else if (score >= 50) {
    tone = "#f59e0b";
    label = "Needs Improvement";
  } else {
    tone = "#ef4444";
    label = "Poor";
  }

  if (customLabel) label = customLabel;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center">
        <ProgressRing pct={score} size={40} stroke={4} color={tone} />
        <span className="mono absolute text-[10.5px] font-bold text-text-primary">{score}</span>
      </div>
      <div>
        <div className="text-[11px] font-medium text-text-primary">Financial health</div>
        <div className="text-[10px] font-semibold" style={{ color: tone }}>
          {label}
        </div>
      </div>
    </div>
  );
}
