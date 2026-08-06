import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatCompact } from "@/utils/formatters";
import { THEME } from "@/constants/theme";

export default function SavingsProgressChart() {
  const { savingsGoals } = useAppContext();

  const data = useMemo(() => {
    return savingsGoals
      .filter((g) => !g.archived)
      .map((g) => ({
        goal: g.title || g.name,
        target: g.target || 0,
        saved: g.saved || 0,
      }));
  }, [savingsGoals]);

  if (data.length === 0) return null;

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Savings Goal Progress</h3>
          <p className="text-[11.5px] text-text-tertiary">Comparison of target savings vs current accumulated amount</p>
        </div>
      </div>

      <div className="mt-2" style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} vertical={false} />
            <XAxis
              dataKey="goal"
              tick={{ fill: THEME.textTertiary, fontSize: 11 }}
              axisLine={{ stroke: THEME.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: THEME.textTertiary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
            />
            <Tooltip
              contentStyle={{
                background: THEME.surfaceRaised,
                border: `1px solid ${THEME.borderStrong}`,
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: THEME.textPrimary, fontWeight: 600, marginBottom: 4 }}
              formatter={(val) => [formatCurrency(val), ""]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => <span style={{ color: THEME.textSecondary }}>{value}</span>}
            />
            <Bar dataKey="target" name="Target Amount" fill={THEME.accent} opacity={0.3} radius={[4, 4, 0, 0]} />
            <Bar dataKey="saved" name="Current Saved" fill={THEME.success} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
