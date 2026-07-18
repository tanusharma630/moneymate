import { Receipt } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import TransactionCard from "@/components/cards/TransactionCard";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { useTransactionsQuery } from "@/hooks/useTransactionsQuery";

export default function TransactionsSection() {
  const { data: transactions, isLoading } = useTransactionsQuery();

  return (
    <Card>
      <SectionTitle
        title="Recent Transactions"
        action={
          <button type="button" className="text-[11.5px] text-accent">
            View all
          </button>
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : !transactions || transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          subtitle="Once you log income or expenses, they'll show up here with merchant, category and method."
        />
      ) : (
        <div className="flex flex-col">
          {transactions.map((transaction, i) => (
            <TransactionCard key={transaction.id} transaction={transaction} isFirst={i === 0} />
          ))}
        </div>
      )}
    </Card>
  );
}
