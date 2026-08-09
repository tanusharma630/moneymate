import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, CreditCard, Tag, FileText } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { resolveIcon } from "@/utils/iconMap";
import { formatCurrency } from "@/utils/formatters";
import { getMonogramStyle } from "@/utils/monogram";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {import('@/data/transactionsData').Transaction|null} props.transaction
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 */
export default function TransactionDetailsModal({ isOpen, onClose, transaction, onEdit, onDelete }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!transaction) return null;

  const CategoryIcon = resolveIcon(transaction.categoryIcon);
  const monogram = getMonogramStyle(transaction.merchant);
  const isIncome = transaction.type === "income";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-[440px] rounded-card border border-border-strong bg-surface-raised p-6 shadow-glow"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[17px] font-bold tracking-tight text-text-primary">
                Transaction Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-chip border border-border bg-surface text-text-secondary hover:border-border-strong"
                aria-label="Close modal"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content Header Card */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <div
                  className="mono flex h-11 w-11 shrink-0 items-center justify-center rounded-chip text-[15px] font-bold"
                  style={{ background: monogram.bg, color: monogram.fg }}
                >
                  {transaction.merchant.charAt(0)}
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-text-primary">{transaction.merchant}</h4>
                  <div className="mt-0.5">
                    <Badge tone={isIncome ? "success" : "danger"}>
                      {isIncome ? "INCOME" : "EXPENSE"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`mono text-[17px] font-bold ${isIncome ? "text-success" : "text-text-primary"}`}>
                  {transaction.amount > 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-col gap-3.5 text-[12.5px]">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <Tag size={14} />
                  <span>Category</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-text-primary">
                  <CategoryIcon size={12} className="text-accent" />
                  <span>{transaction.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <Calendar size={14} />
                  <span>Date</span>
                </div>
                <span className="font-medium text-text-primary">{transaction.date}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <CreditCard size={14} />
                  <span>Payment Method</span>
                </div>
                <span className="font-medium text-text-primary">{transaction.method || "UPI"}</span>
              </div>

              <div className="flex items-start justify-between pb-1">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <FileText size={14} />
                  <span>Notes</span>
                </div>
                <span className="max-w-[220px] text-right font-medium text-text-secondary">
                  {transaction.notes || "No notes provided"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-border pt-4">
              {onDelete && (
                <Button type="button" variant="outline" onClick={onDelete} className="text-danger hover:border-danger/40 hover:bg-danger/10">
                  Delete
                </Button>
              )}
              {onEdit && (
                <Button type="button" variant="primary" onClick={onEdit}>
                  Edit Transaction
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
