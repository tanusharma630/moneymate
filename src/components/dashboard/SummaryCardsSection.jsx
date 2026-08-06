import { Wallet, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";
import SummaryCard from "@/components/cards/SummaryCard";
import { useAppContext } from "@/context/AppContext";

/**
 * The top-of-dashboard row of four summary cards: Total Balance, Monthly
 * Income, Monthly Expenses, Savings. Each pulls its layout variant and tone
 * so the row reads as four distinct widgets rather than repeated cards.
 */
export default function SummaryCardsSection() {
  const { summaryMetrics, derivedStats, sparklines } = useAppContext();
  const { totalBalance, monthlyIncome, monthlyExpenses, savings } = summaryMetrics;

  const currentBalance = derivedStats ? (summaryMetrics.totalBalance.value + derivedStats.netCashFlow - (monthlyIncome.value - monthlyExpenses.value)) : totalBalance.value;
  const currentIncome = derivedStats ? derivedStats.totalIncome || monthlyIncome.value : monthlyIncome.value;
  const currentExpenses = derivedStats ? derivedStats.totalExpenses || monthlyExpenses.value : monthlyExpenses.value;
  const currentSavings = derivedStats ? derivedStats.totalGoalSaved || savings.value : savings.value;
  const ringPct = derivedStats ? derivedStats.overallGoalPct || savings.targetPct : savings.targetPct;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total Balance"
        icon={Wallet}
        tone="accent"
        layout="hero"
        value={currentBalance}
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
        value={currentIncome}
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
        value={currentExpenses}
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
        value={currentSavings}
        changePct={savings.changePct}
        comparisonLabel={savings.comparisonLabel}
        updatedLabel={savings.updatedLabel}
        ringPct={ringPct}
      />
    </div>
  );
}

