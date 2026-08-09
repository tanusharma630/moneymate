import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "@/components/ui/Card";
import { groupByCategory, CATEGORY_COLORS } from "@/utils/reportSelectors";
import { formatCurrency } from "@/utils/formatters";
import { THEME } from "@/constants/theme";

export default function CategoryPieChart({ transactions }) {
  const data = useMemo(() => {
    const grouped = groupByCategory(transactions, "expense");
    return grouped.map((item) => ({
      name: item.category,
      value: item.total,
      color: CATEGORY_COLORS[item.category] || THEME.accent,
    }));
  }, [transactions]);

  if (data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-text-tertiary">No expense data available for pie chart breakdown.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-2">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Expense Distribution</h3>
        <p className="text-[11.5px] text-text-tertiary">Share of total spend by category</p>
      </div>

      <div className="mt-2" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={THEME.surface} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: THEME.surfaceRaised,
                border: `1px solid ${THEME.borderStrong}`,
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(val) => [formatCurrency(val), "Spent"]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              formatter={(value) => <span style={{ color: THEME.textSecondary }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
