import { Wallet, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";
import SummaryCard from "@/components/cards/SummaryCard";
import { summaryMetrics } from "@/data/summaryData";
import { sparklines } from "@/data/chartData";

/**
 * The top-of-dashboard row of four summary cards: Total Balance, Monthly
 * Income, Monthly Expenses, Savings. Each pulls its layout variant and tone
 * so the row reads as four distinct widgets rather than repeated cards.
 */
export default function SummaryCardsSection() {
  const { totalBalance, monthlyIncome, monthlyExpenses, savings } = summaryMetrics;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total Balance"
        icon={Wallet}
        tone="accent"
        layout="hero"
        value={totalBalance.value}
        changePct={totalBalance.changePct}
        comparisonLabel={totalBalance.comparisonLabel}
        updatedLabel={totalBalance.updatedLabel}
        sparklineData={sparklines.balance}
      />
      <SummaryCard
        label="Monthly Income"
        icon={ArrowUpRight}
        tone="success"
        layout="spark"
        value={monthlyIncome.value}
        changePct={monthlyIncome.changePct}
        comparisonLabel={monthlyIncome.comparisonLabel}
        updatedLabel={monthlyIncome.updatedLabel}
        sparklineData={sparklines.income}
      />
      <SummaryCard
        label="Monthly Expenses"
        icon={ArrowDownRight}
        tone="danger"
        layout="spark"
        value={monthlyExpenses.value}
        changePct={monthlyExpenses.changePct}
        comparisonLabel={monthlyExpenses.comparisonLabel}
        updatedLabel={monthlyExpenses.updatedLabel}
        sparklineData={sparklines.expenses}
      />
      <SummaryCard
        label="Savings"
        icon={Target}
        tone="accent"
        layout="ring"
        value={savings.value}
        changePct={savings.changePct}
        comparisonLabel={savings.comparisonLabel}
        updatedLabel={savings.updatedLabel}
        ringPct={savings.targetPct}
      />
    </div>
  );
}
