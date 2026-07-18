import { Receipt } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import TransactionCard from "@/components/cards/TransactionCard";

/**
 * Renders a full list of transactions inside a card, with a title and an
 * empty state. Used by the Income and Expenses pages, which each pass in a
 * pre-filtered subset of the transactions data.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {import('@/data/transactionsData').Transaction[]} props.transactions
 * @param {string} props.emptyTitle
 * @param {string} props.emptySubtitle
 */
export default function TransactionsList({ title, transactions, emptyTitle, emptySubtitle }) {
  return (
    <Card>
      <SectionTitle title={title} />
      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title={emptyTitle} subtitle={emptySubtitle} />
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
