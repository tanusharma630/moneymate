import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import Card from "@/components/ui/Card";
import { TREND_BY_RANGE } from "@/data/chartData";
import { formatCurrency, formatCompact } from "@/utils/formatters";
import { THEME } from "@/constants/theme";
import { cn } from "@/utils/cn";

const RANGES = ["Week", "Month", "Year"];

const RANGE_DESCRIPTION = {
  Week: "Daily trend, last 7 days",
  Month: "Monthly trend, last 6 months",
  Year: "Monthly trend, last 12 months",
};

const RANGE_HIGHLIGHT = {
  Week: "This week",
  Month: "This month",
  Year: "This year",
};

function CurrentPeriodDot({ cx, cy, index, dataLength }) {
  if (index !== dataLength - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={THEME.accent} fillOpacity={0.15} />
      <circle cx={cx} cy={cy} r={4} fill={THEME.accent} stroke={THEME.bg} strokeWidth={2} />
    </g>
  );
}

/**
 * The dashboard's visual centerpiece: an income-vs-expenses area chart with
 * Week/Month/Year range switching, an average reference line, a
 * previous-period comparison overlay, and a highlighted current period.
 */
export default function AnalyticsChart() {
  const [range, setRange] = useState("Month");
  const [compare, setCompare] = useState(false);

  const baseData = TREND_BY_RANGE[range];
  const chartData = useMemo(
    () => baseData.map((d) => ({ ...d, prevIncome: Math.round(d.income * 0.87) })),
    [baseData]
  );
  const averageIncome = useMemo(
    () => baseData.reduce((sum, d) => sum + d.income, 0) / baseData.length,
    [baseData]
  );

  return (
    <Card className="xl:col-span-8" style={{ minHeight: 380 }}>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Income vs Expenses</h3>
          <p className="mt-0.5 text-[11.5px] text-text-tertiary">{RANGE_DESCRIPTION[range]}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LegendDot color={THEME.accent} label="Income" />
          <LegendDot color={THEME.textTertiary} label="Expenses" />
          <LegendLine color={THEME.accent2} label="Average" />
          {compare && <LegendLine color={THEME.accent} dashed label="Previous period" />}
        </div>
      </div>

      <div className="mb-1 mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[10.5px] font-medium text-accent">
              {RANGE_HIGHLIGHT[range]} highlighted
            </span>
          </span>
          <button
            type="button"
            onClick={() => setCompare((v) => !v)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
              compare
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-border bg-surface-raised text-text-secondary"
            )}
          >
            Compare vs previous
          </button>
        </div>

        <div className="flex items-center rounded-lg border border-border bg-surface-raised p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-3 py-1 text-[11px] font-semibold transition-colors",
                range === r ? "bg-accent text-bg" : "text-text-secondary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2" style={{ height: 270 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mm-income-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={THEME.accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={THEME.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mm-expense-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={THEME.textTertiary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={THEME.textTertiary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: THEME.textTertiary, fontSize: 11.5 }}
              axisLine={{ stroke: THEME.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: THEME.textTertiary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
            />
            <ReferenceLine y={averageIncome} stroke={THEME.accent2} strokeDasharray="4 4" strokeOpacity={0.6} />
            <Tooltip
              contentStyle={{
                background: THEME.surfaceRaised,
                border: `1px solid ${THEME.borderStrong}`,
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: THEME.textPrimary, fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: THEME.textSecondary }}
              formatter={(v) => [formatCurrency(v), ""]}
              cursor={{ stroke: THEME.borderStrong, strokeWidth: 1 }}
              animationDuration={150}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke={THEME.accent}
              strokeWidth={2}
              fill="url(#mm-income-grad)"
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              dot={(p) => <CurrentPeriodDot key={`income-${p.index}`} {...p} dataLength={chartData.length} />}
              activeDot={{ r: 5, fill: THEME.accent, stroke: THEME.bg, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={THEME.textTertiary}
              strokeWidth={2}
              fill="url(#mm-expense-grad)"
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              activeDot={{ r: 5, fill: THEME.textTertiary, stroke: THEME.bg, strokeWidth: 2 }}
            />
            {compare && (
              <Area
                type="monotone"
                dataKey="prevIncome"
                stroke={THEME.accent}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="transparent"
                isAnimationActive
                animationDuration={600}
                dot={false}
                activeDot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-[11.5px] text-text-secondary">{label}</span>
    </div>
  );
}

function LegendLine({ color, label, dashed }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block"
        style={{
          width: 10,
          height: 2,
          background: dashed ? "transparent" : color,
          borderTop: dashed ? `1px dashed ${color}` : undefined,
          opacity: 0.6,
        }}
      />
      <span className="text-[11.5px] text-text-secondary">{label}</span>
    </div>
  );
}
