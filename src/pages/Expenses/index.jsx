import { Receipt, TrendingDown, CreditCard } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/cards/StatCard";
import TransactionsList from "@/components/tables/TransactionsList";
import { useTransactionsQuery } from "@/hooks/useTransactionsQuery";
import { selectExpenseTransactions, sumTransactions } from "@/utils/transactionSelectors";
import { summaryMetrics } from "@/data/summaryData";
import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function ExpensesPage() {
  const { data: transactions, isLoading } = useTransactionsQuery();
  const expenseTransactions = selectExpenseTransactions(transactions ?? []);
  const totalLogged = sumTransactions(expenseTransactions);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Expenses"
        description="Everything you've spent this month, across every category and payment method."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="This month" value={summaryMetrics.monthlyExpenses.value} icon={Receipt} valueClassName="text-danger" />
        <StatCard label="Logged transactions" value={totalLogged} icon={TrendingDown} />
        <StatCard label="Largest expense" value={6200} icon={CreditCard} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-5">
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <TransactionsList
          title="Expense history"
          transactions={expenseTransactions}
          emptyTitle="No expenses logged yet"
          emptySubtitle="Purchases and bills will appear here once added."
        />
      )}
    </div>
  );
}
