import { useState } from "react";
import { MoreHorizontal, Eye, Pencil, Copy, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { resolveIcon } from "@/utils/iconMap";
import { formatCurrency } from "@/utils/formatters";
import { getMonogramStyle } from "@/utils/monogram";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cn } from "@/utils/cn";

const QUICK_ACTIONS = [
  { key: "view", icon: Eye, label: "View Details" },
  { key: "edit", icon: Pencil, label: "Edit" },
  { key: "duplicate", icon: Copy, label: "Duplicate" },
  { key: "delete", icon: Trash2, label: "Delete", danger: true },
];

/**
 * @param {Object} props
 * @param {import('@/data/transactionsData').Transaction} props.transaction
 * @param {boolean} [props.isFirst]
 * @param {(tx: import('@/data/transactionsData').Transaction) => void} [props.onView]
 * @param {(tx: import('@/data/transactionsData').Transaction) => void} [props.onEdit]
 * @param {(tx: import('@/data/transactionsData').Transaction) => void} [props.onDelete]
 * @param {(tx: import('@/data/transactionsData').Transaction) => void} [props.onDuplicate]
 */
export default function TransactionCard({ transaction, isFirst, onView, onEdit, onDelete, onDuplicate }) {
  const [hovered, setHovered] = useState(false);
  const { isOpen: menuOpen, toggle: toggleMenu, close: closeMenu } = useDisclosure(false);
  const CategoryIcon = resolveIcon(transaction.categoryIcon);
  const monogram = getMonogramStyle(transaction.merchant);
  const isIncome = transaction.type === "income";

  const handleAction = (actionKey, e) => {
    e.stopPropagation();
    closeMenu();
    if (actionKey === "view") onView?.(transaction);
    if (actionKey === "edit") onEdit?.(transaction);
    if (actionKey === "duplicate") onDuplicate?.(transaction);
    if (actionKey === "delete") onDelete?.(transaction);
  };

  return (
    <div
      className={cn(
        "relative -mx-2 flex items-center justify-between rounded-chip px-2 py-2.5 transition-colors cursor-pointer",
        !isFirst && "border-t border-border",
        hovered && "bg-white/[0.025]"
      )}
      onClick={() => onView?.(transaction)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        closeMenu();
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="mono flex h-9 w-9 shrink-0 items-center justify-center rounded-chip text-[12.5px] font-bold"
          style={{ background: monogram.bg, color: monogram.fg }}
        >
          {transaction.merchant.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-medium text-text-primary">{transaction.merchant}</span>
            <Badge tone={isIncome ? "success" : "danger"}>{isIncome ? "INCOME" : "EXPENSE"}</Badge>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-text-tertiary">
            <CategoryIcon size={10} />
            <span className="text-[10.5px]">{transaction.category}</span>
            <span className="text-[8px]">•</span>
            <span className="text-[10.5px]">{transaction.method}</span>
            <span className="text-[8px]">•</span>
            <span className="text-[10.5px]">{transaction.date}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={cn("mono text-[13px] font-semibold", isIncome ? "text-success" : "text-text-primary")}>
          {transaction.amount > 0 ? "+" : "-"}
          {formatCurrency(Math.abs(transaction.amount))}
        </span>
        <div className="relative w-[22px]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={`Actions for ${transaction.merchant}`}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md transition-opacity duration-200 hover:bg-white/10",
              hovered || menuOpen ? "opacity-100" : "opacity-0"
            )}
          >
            <MoreHorizontal size={14} className="text-text-tertiary" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1 w-[140px] rounded-chip border border-border-strong bg-surface-hi p-1 shadow-elevate">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={(e) => handleAction(action.key, e)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] font-medium transition-colors",
                    action.danger
                      ? "text-danger hover:bg-danger/10"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  )}
                >
                  <action.icon size={12} /> {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
