import ProgressRing from "@/components/ui/ProgressRing";
import { THEME } from "@/constants/theme";

/**
 * @param {Object} props
 * @param {number} props.score - 0-100
 */
export default function HealthScoreBadge({ score }) {
  const tone = score >= 75 ? THEME.success : score >= 50 ? THEME.warning : THEME.danger;
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs attention";

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center">
        <ProgressRing pct={score} size={40} stroke={4} color={tone} />
        <span className="mono absolute text-[10.5px] font-bold text-text-primary">{score}</span>
      </div>
      <div>
        <div className="text-[11px] font-medium text-text-primary">Financial health</div>
        <div className="text-[10px]" style={{ color: tone }}>
          {label}
        </div>
      </div>
    </div>
  );
}
