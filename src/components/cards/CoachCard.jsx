import { Sparkles, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import HealthScoreBadge from "@/components/cards/HealthScoreBadge";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/utils/formatters";

/**
 * The dashboard's hero AI feature. Presents the coach's daily insight as an
 * assistant persona rather than a plain stat card: avatar, live status,
 * a labeled insight/prediction/action stack, and a highlighted savings
 * estimate with a call to action.
 */
export default function CoachCard() {
  const { coachInsight } = useAppContext();
  return (
    <Card
      glow
      className="flex flex-col border-accent-line bg-gradient-to-br from-surface-raised to-surface xl:col-span-4"
      style={{ boxShadow: "0 0 0 1px rgba(110,123,242,0.05)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2">
            <Sparkles size={14} className="text-bg" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">MoneyMate Coach</div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[10px] text-text-tertiary">Analyzing live spend</span>
            </div>
          </div>
        </div>
        <HealthScoreBadge score={coachInsight.healthScore} />
      </div>

      <div className="flex flex-col gap-3">
        <InsightBlock label="Today's Insight" text={coachInsight.todayInsight} emphasis />
        <InsightBlock label="Weekly Prediction" text={coachInsight.weeklyPrediction} />
        <InsightBlock label="Recommended Action" text={coachInsight.recommendedAction} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-chip border border-success/25 bg-success-soft p-3">
        <span className="text-[11px] text-text-secondary">Potential savings</span>
        <span className="mono text-[15px] font-bold text-success">
          {formatCurrency(coachInsight.potentialSavings)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10.5px] text-text-tertiary">Based on 6-month pattern</span>
        <Button variant="soft" size="sm">
          Apply <ArrowRight size={11} />
        </Button>
      </div>
    </Card>
  );
}

function InsightBlock({ label, text, emphasis }) {
  return (
    <div>
      <span className="text-[10px] font-semibold tracking-wide text-accent">{label.toUpperCase()}</span>
      <p
        className={
          emphasis
            ? "mt-1 text-[13.5px] leading-relaxed text-text-primary"
            : "mt-1 text-[12.5px] leading-relaxed text-text-secondary"
        }
      >
        {text}
      </p>
    </div>
  );
}
