import { Sparkles, ArrowRight, AlertTriangle, Lightbulb } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import HealthScoreBadge from "@/components/cards/HealthScoreBadge";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/utils/formatters";

/**
 * Intelligent AI Coach component analyzing live MongoDB financial data.
 */
export default function CoachCard() {
  const { aiInsights, coachInsight } = useAppContext();
  const ai = aiInsights || coachInsight;

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
            <div className="text-[13px] font-semibold text-text-primary">MoneyMate Coach AI</div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[10px] text-text-tertiary">Analyzing live MongoDB data</span>
            </div>
          </div>
        </div>
        <HealthScoreBadge score={ai.healthScore ?? 78} label={ai.healthLabel} />
      </div>

      {/* Warning Cards for Risks */}
      {ai.warnings && ai.warnings.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {ai.warnings.map((w) => (
            <div
              key={w.id || w.title}
              className={`flex items-start gap-2 rounded-chip border p-2.5 text-xs ${
                w.tone === "danger"
                  ? "border-danger/30 bg-danger-soft text-danger"
                  : "border-warning/30 bg-warning-soft text-warning"
              }`}
            >
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">{w.title}</div>
                <div className="mt-0.5 text-[11.5px] opacity-90">{w.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insight Stack */}
      <div className="flex flex-col gap-3">
        <InsightBlock label="Today's Insight" text={ai.todayInsight} emphasis />
        <InsightBlock label="Monthly Prediction" text={ai.weeklyPrediction} />
        <InsightBlock label="Recommended Action" text={ai.recommendedAction} />
      </div>

      {/* Smart Suggestions */}
      {ai.suggestions && ai.suggestions.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5 rounded-chip border border-border bg-bg/50 p-2.5">
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-accent">
            <Lightbulb size={12} /> SMART SUGGESTIONS
          </div>
          {ai.suggestions.map((s, idx) => (
            <div key={idx} className="text-[11.5px] text-text-secondary">
              • {s}
            </div>
          ))}
        </div>
      )}

      {/* Potential Savings */}
      <div className="mt-4 flex items-center justify-between rounded-chip border border-success/25 bg-success-soft p-3">
        <span className="text-[11px] text-text-secondary">Potential savings</span>
        <span className="mono text-[15px] font-bold text-success">
          {formatCurrency(ai.potentialSavings ?? 900)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10.5px] text-text-tertiary">Real-time MongoDB analysis</span>
        <Button variant="soft" size="sm">
          Apply <ArrowRight size={11} />
        </Button>
      </div>
    </Card>
  );
}

function InsightBlock({ label, text, emphasis }) {
  if (!text) return null;
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
