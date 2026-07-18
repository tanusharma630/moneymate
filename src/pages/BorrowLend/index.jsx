import { HandCoins, ArrowUpRight, ArrowDownRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/cards/StatCard";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import LendCard from "@/components/cards/LendCard";
import { borrowLendRecords } from "@/data/borrowLendData";

export default function BorrowLendPage() {
  const lent = borrowLendRecords.filter((r) => r.type === "lent");
  const borrowed = borrowLendRecords.filter((r) => r.type === "borrowed");
  const totalLent = lent.reduce((sum, r) => sum + r.amount, 0);
  const totalBorrowed = borrowed.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Borrow & Lend"
        description="Money you've lent to others, and money you owe back."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="You're owed" value={totalLent} icon={ArrowUpRight} valueClassName="text-success" />
        <StatCard label="You owe" value={totalBorrowed} icon={ArrowDownRight} valueClassName="text-danger" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RecordGroup title="You lent" records={lent} />
        <RecordGroup title="You borrowed" records={borrowed} />
      </div>
    </div>
  );
}

function RecordGroup({ title, records }) {
  return (
    <Card>
      <SectionTitle title={title} />
      {records.length === 0 ? (
        <EmptyState icon={HandCoins} title="Nothing here" subtitle="Records will show up as you add them." />
      ) : (
        <div className="flex flex-col">
          {records.map((record, i) => (
            <LendCard key={record.id} record={record} isFirst={i === 0} />
          ))}
        </div>
      )}
    </Card>
  );
}
