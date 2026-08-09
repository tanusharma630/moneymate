import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { useAppContext } from "@/context/AppContext";

/**
 * @param {Object} props
 * @param {import('@/data/borrowLendData').LendRecord} props.record
 * @param {boolean} [props.isFirst]
 */
export default function LendCard({ record, isFirst }) {
  const { toggleBorrowLendStatus } = useAppContext();
  const isLent = record.type === "lent";
  const isOverdue = record.status === "overdue";
  const isSettled = record.status === "settled";

  return (
    <div className={cn("flex items-center justify-between py-2.5", !isFirst && "border-t border-border")}>
      <div>
        <div className="text-[12.5px] font-medium text-text-primary">{record.person}</div>
        <div className="mt-0.5 text-[10.5px] text-text-tertiary">
          {isLent ? "You lent" : "You borrowed"} · Due {record.dueDate}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={cn("mono text-[13px] font-semibold", isSettled ? "line-through text-text-tertiary" : isLent ? "text-success" : "text-danger")}>
          {isLent ? "+" : "-"}
          {formatCurrency(record.amount)}
        </span>
        <button
          type="button"
          onClick={() => toggleBorrowLendStatus(record.id)}
          title="Click to toggle status (Settled/Pending)"
          className="transition-transform active:scale-95"
        >
          <Badge tone={isSettled ? "success" : isOverdue ? "danger" : "warning"}>
            {isSettled ? <CheckCircle size={10} /> : isOverdue ? <AlertCircle size={10} /> : <Clock size={10} />}
            {record.status}
          </Badge>
        </button>
      </div>
    </div>
  );
}
