import { Wallet, TrendingUp, Calendar } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/cards/StatCard";
import TransactionsList from "@/components/tables/TransactionsList";
import { useTransactionsQuery } from "@/hooks/useTransactionsQuery";
import { selectIncomeTransactions, sumTransactions } from "@/utils/transactionSelectors";
import { summaryMetrics } from "@/data/summaryData";
import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function IncomePage() {
  const { data: transactions, isLoading } = useTransactionsQuery();
  const incomeTransactions = selectIncomeTransactions(transactions ?? []);
  const totalLogged = sumTransactions(incomeTransactions);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Income"
        description="Every payment coming in, across salary, freelance work, and other sources."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="This month" value={summaryMetrics.monthlyIncome.value} icon={Wallet} valueClassName="text-success" />
        <StatCard label="Logged transactions" value={totalLogged} icon={TrendingUp} />
        <StatCard label="Last payout" value={72000} icon={Calendar} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-5">
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <TransactionsList
          title="Income history"
          transactions={incomeTransactions}
          emptyTitle="No income logged yet"
          emptySubtitle="Salary, freelance payouts, and other income will appear here once added."
        />
      )}
    </div>
  );
}
