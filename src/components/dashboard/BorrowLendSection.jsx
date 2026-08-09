import { HandCoins } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import LendCard from "@/components/cards/LendCard";
import { useAppContext } from "@/context/AppContext";

export default function BorrowLendSection() {
  const { borrowLendRecords, openBorrowLendModal } = useAppContext();

  if (borrowLendRecords.length === 0) {
    return (
      <Card className="xl:col-span-5">
        <SectionTitle title="Borrow & Lend" />
        <EmptyState
          icon={HandCoins}
          title="Nothing outstanding"
          subtitle="Money you lend or borrow from friends and family will show up here."
          actionLabel="Add record"
          onAction={() => openBorrowLendModal()}
        />
      </Card>
    );
  }

  return (
    <Card className="xl:col-span-5">
      <SectionTitle
        title="Borrow & Lend"
        action={
          <button
            type="button"
            onClick={() => openBorrowLendModal()}
            className="text-[11.5px] font-medium text-accent hover:underline"
          >
            + Add record
          </button>
        }
      />
      <div className="flex flex-col">
        {borrowLendRecords.map((record, i) => (
          <LendCard key={record.id} record={record} isFirst={i === 0} />
        ))}
      </div>
    </Card>
  );
}
