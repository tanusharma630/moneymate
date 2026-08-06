import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Card from "@/components/ui/Card";
import { groupByCategory, CATEGORY_COLORS } from "@/utils/reportSelectors";
import { formatCurrency, formatCompact } from "@/utils/formatters";
import { THEME } from "@/constants/theme";

export default function CategoryBarChart({ transactions }) {
  const data = useMemo(() => {
    const grouped = groupByCategory(transactions, "expense");
    return grouped.slice(0, 5).map((item) => ({
      category: item.category,
      amount: item.total,
      color: CATEGORY_COLORS[item.category] || THEME.accent,
    }));
  }, [transactions]);

  return (
    <Card className="flex flex-col gap-2">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Top Spending Categories</h3>
        <p className="text-[11.5px] text-text-tertiary">Highest spending categories for the selected period</p>
      </div>

      <div className="mt-2" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <XAxis type="number" tickFormatter={formatCompact} tick={{ fill: THEME.textTertiary, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="category" tick={{ fill: THEME.textPrimary, fontSize: 11.5 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{
                background: THEME.surfaceRaised,
                border: `1px solid ${THEME.borderStrong}`,
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(val) => [formatCurrency(val), "Amount"]}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
