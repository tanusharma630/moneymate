import { useState, useMemo } from "react";
import { Receipt, Filter, ArrowUpDown } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import SearchBar from "@/components/common/SearchBar";
import TransactionCard from "@/components/cards/TransactionCard";
import TransactionDetailsModal from "@/components/modals/TransactionDetailsModal";
import TransactionFormModal from "@/components/modals/TransactionFormModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useAppContext } from "@/context/AppContext";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {import('@/data/transactionsData').Transaction[]} props.transactions
 * @param {string} props.emptyTitle
 * @param {string} props.emptySubtitle
 * @param {React.ReactNode} [props.action]
 */
export default function TransactionsList({
  title,
  transactions = [],
  emptyTitle = "No transactions found",
  emptySubtitle = "Try adjusting your search or filters.",
  action,
}) {
  const { editTransaction, deleteTransaction, duplicateTransaction } = useAppContext();

  // Filter & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  // Modal states
  const [viewingTx, setViewingTx] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  // Dynamically extract categories present in transactions
  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return ["All", ...Array.from(cats)];
  }, [transactions]);

  // Filter and sort logic
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // 1. Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.method && t.method.toLowerCase().includes(q)) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // 2. Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 3. Date filter
    if (selectedDateFilter === "today") {
      result = result.filter((t) => t.date.toLowerCase().includes("today"));
    } else if (selectedDateFilter === "yesterday") {
      result = result.filter((t) => t.date.toLowerCase().includes("yesterday"));
    } else if (selectedDateFilter === "this_month") {
      result = result.filter(
        (t) =>
          t.date.toLowerCase().includes("today") ||
          t.date.toLowerCase().includes("yesterday") ||
          t.date.toLowerCase().includes("jul") ||
          t.date.toLowerCase().includes("aug")
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === "amount_desc") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      if (sortBy === "amount_asc") {
        return Math.abs(a.amount) - Math.abs(b.amount);
      }
      if (sortBy === "date_asc") {
        return 1; // Reverse order for oldest first
      }
      // Default: date_desc (Newest First)
      return 0;
    });

    return result;
  }, [transactions, searchTerm, selectedCategory, selectedDateFilter, sortBy]);

  return (
    <>
      <Card>
        <SectionTitle title={title} action={action} />

        {/* Filter Controls Bar */}
        <div className="mb-4 mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3.5">
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <SearchBar
              placeholder="Search merchant, category..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 rounded-chip border border-border bg-surface px-2.5 py-1.5 text-text-secondary">
              <Filter size={12} className="text-text-tertiary shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-[11.5px] font-medium text-text-primary outline-none cursor-pointer"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-surface-raised text-text-primary">
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-1.5 rounded-chip border border-border bg-surface px-2.5 py-1.5 text-text-secondary">
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-transparent text-[11.5px] font-medium text-text-primary outline-none cursor-pointer"
              >
                <option value="all" className="bg-surface-raised text-text-primary">All Time</option>
                <option value="today" className="bg-surface-raised text-text-primary">Today</option>
                <option value="yesterday" className="bg-surface-raised text-text-primary">Yesterday</option>
                <option value="this_month" className="bg-surface-raised text-text-primary">This Month</option>
              </select>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5 rounded-chip border border-border bg-surface px-2.5 py-1.5 text-text-secondary">
              <ArrowUpDown size={12} className="text-text-tertiary shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[11.5px] font-medium text-text-primary outline-none cursor-pointer"
              >
                <option value="date_desc" className="bg-surface-raised text-text-primary">Newest First</option>
                <option value="date_asc" className="bg-surface-raised text-text-primary">Oldest First</option>
                <option value="amount_desc" className="bg-surface-raised text-text-primary">Amount: High to Low</option>
                <option value="amount_asc" className="bg-surface-raised text-text-primary">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Cards List or Empty State */}
        {filteredAndSortedTransactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={transactions.length === 0 ? emptyTitle : "No matching transactions"}
            subtitle={transactions.length === 0 ? emptySubtitle : "Try clearing your search query or filters."}
          />
        ) : (
          <div className="flex flex-col">
            {filteredAndSortedTransactions.map((transaction, i) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                isFirst={i === 0}
                onView={(tx) => setViewingTx(tx)}
                onEdit={(tx) => setEditingTx(tx)}
                onDelete={(tx) => setDeletingTx(tx)}
                onDuplicate={(tx) => duplicateTransaction(tx.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={!!viewingTx}
        onClose={() => setViewingTx(null)}
        transaction={viewingTx}
        onEdit={() => {
          const txToEdit = viewingTx;
          setViewingTx(null);
          setEditingTx(txToEdit);
        }}
        onDelete={() => {
          const txToDelete = viewingTx;
          setViewingTx(null);
          setDeletingTx(txToDelete);
        }}
      />

      {/* Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        transactionToEdit={editingTx}
        defaultType={editingTx?.type || "income"}
        onSubmit={(values) => {
          if (editingTx) {
            editTransaction(editingTx.id, values);
          }
        }}
        title="Edit Transaction"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        merchantName={deletingTx?.merchant}
        onConfirm={() => {
          if (deletingTx) {
            deleteTransaction(deletingTx.id);
          }
        }}
      />
    </>
  );
}
