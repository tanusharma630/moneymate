import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { getMonogramStyle } from "@/utils/monogram";
import TransactionDetailsModal from "@/components/modals/TransactionDetailsModal";
import TransactionFormModal from "@/components/modals/TransactionFormModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

/**
 * Full-screen search overlay triggered by ⌘K or clicking the navbar search bar.
 * Filters all transactions live, keyboard-navigable, ESC to close.
 */
export default function GlobalSearchModal() {
  const {
    isSearchOpen,
    closeSearch,
    transactions,
    editTransaction,
    deleteTransaction,
    duplicateTransaction,
  } = useAppContext();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Sub-modal states
  const [viewingTx, setViewingTx] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeSearch();
    };
    if (isSearchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions.slice(0, 8);
    return transactions.filter(
      (t) =>
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.method && t.method.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        t.date.toLowerCase().includes(q)
    );
  }, [transactions, query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (results[selectedIndex]) {
          closeSearch();
          setViewingTx(results[selectedIndex]);
        }
      }
    },
    [results, selectedIndex, closeSearch]
  );

  const handleSelect = (tx) => {
    closeSearch();
    setViewingTx(tx);
  };

  return (
    <>
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-card border border-border-strong bg-surface-raised shadow-glow"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <Search size={16} className="shrink-0 text-text-tertiary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search transactions, categories, merchants..."
                  className="flex-1 bg-transparent text-[13.5px] text-text-primary placeholder:text-text-tertiary outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="shrink-0 text-text-tertiary hover:text-text-secondary"
                  >
                    <X size={14} />
                  </button>
                )}
                <kbd className="mono shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-text-tertiary">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="py-10 text-center">
                    <Search size={24} className="mx-auto mb-3 text-text-tertiary" />
                    <p className="text-[13px] font-medium text-text-secondary">No results for "{query}"</p>
                    <p className="mt-1 text-[11.5px] text-text-tertiary">
                      Try a different merchant name, category, or payment method.
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {!query && (
                      <div className="px-4 pb-1.5 pt-1">
                        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-text-tertiary">
                          Recent transactions
                        </span>
                      </div>
                    )}
                    {results.map((tx, i) => {
                      const monogram = getMonogramStyle(tx.merchant);
                      const isIncome = tx.type === "income";
                      const isSelected = i === selectedIndex;

                      return (
                        <button
                          key={tx.id}
                          type="button"
                          onClick={() => handleSelect(tx)}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            isSelected && "bg-white/[0.04]"
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className="mono flex h-8 w-8 shrink-0 items-center justify-center rounded-chip text-[11px] font-bold"
                            style={{ background: monogram.bg, color: monogram.fg }}
                          >
                            {tx.merchant.charAt(0)}
                          </div>

                          {/* Text */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-[12.5px] font-medium text-text-primary">
                                {tx.merchant}
                              </span>
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                                  isIncome
                                    ? "bg-success/15 text-success"
                                    : "bg-danger/15 text-danger"
                                )}
                              >
                                {isIncome ? "INCOME" : "EXPENSE"}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-text-tertiary">
                              <span>{tx.category}</span>
                              <span className="text-[8px]">•</span>
                              <span>{tx.date}</span>
                              <span className="text-[8px]">•</span>
                              <span>{tx.method}</span>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="flex shrink-0 items-center gap-1.5">
                            {isIncome ? (
                              <ArrowUpRight size={12} className="text-success" />
                            ) : (
                              <ArrowDownRight size={12} className="text-danger" />
                            )}
                            <span
                              className={cn(
                                "mono text-[12.5px] font-semibold",
                                isIncome ? "text-success" : "text-text-primary"
                              )}
                            >
                              {isIncome ? "+" : "-"}
                              {formatCurrency(Math.abs(tx.amount))}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 border-t border-border px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-[10.5px] text-text-tertiary">
                  <kbd className="mono rounded border border-border px-1 py-0.5 text-[9px]">↑↓</kbd>
                  Navigate
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-text-tertiary">
                  <kbd className="mono rounded border border-border px-1 py-0.5 text-[9px]">↵</kbd>
                  Open
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-text-tertiary">
                  <kbd className="mono rounded border border-border px-1 py-0.5 text-[9px]">ESC</kbd>
                  Close
                </div>
                <span className="ml-auto text-[10.5px] text-text-tertiary">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction sub-modals (mounted outside the search overlay) */}
      <TransactionDetailsModal
        isOpen={!!viewingTx}
        onClose={() => setViewingTx(null)}
        transaction={viewingTx}
        onEdit={() => {
          const tx = viewingTx;
          setViewingTx(null);
          setEditingTx(tx);
        }}
        onDelete={() => {
          const tx = viewingTx;
          setViewingTx(null);
          setDeletingTx(tx);
        }}
      />

      <TransactionFormModal
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        transactionToEdit={editingTx}
        defaultType={editingTx?.type || "income"}
        onSubmit={(values) => {
          if (editingTx) editTransaction(editingTx.id, values);
        }}
        title="Edit Transaction"
      />

      <DeleteConfirmModal
        isOpen={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        merchantName={deletingTx?.merchant}
        onConfirm={() => {
          if (deletingTx) deleteTransaction(deletingTx.id);
        }}
      />
    </>
  );
}
