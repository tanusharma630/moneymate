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
import { getBudgetVsActual } from "@/utils/reportSelectors";
import { formatCurrency, formatCompact } from "@/utils/formatters";
import { getThemeColors } from "@/constants/theme";

export default function BudgetVsActualChart() {
  const { transactions, budgetCategories, theme } = useAppContext();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);

  const data = useMemo(
    () => getBudgetVsActual(transactions, budgetCategories),
    [transactions, budgetCategories]
  );

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Budget vs Actual</h3>
          <p className="text-[11.5px] text-text-tertiary">Comparison of set budget limit against actual expenditure</p>
        </div>
      </div>

      <div className="mt-2" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: themeColors.textTertiary, fontSize: 11 }}
              axisLine={{ stroke: themeColors.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: themeColors.textTertiary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
            />
            <Tooltip
              contentStyle={{
                background: themeColors.surfaceRaised,
                border: `1px solid ${themeColors.borderStrong}`,
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: themeColors.textPrimary, fontWeight: 600, marginBottom: 4 }}
              formatter={(val) => [formatCurrency(val), ""]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => <span style={{ color: themeColors.textSecondary }}>{value}</span>}
            />
            <Bar dataKey="budget" name="Budget Limit" fill={themeColors.accent} opacity={0.4} radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" name="Actual Spent" fill={themeColors.accent2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

