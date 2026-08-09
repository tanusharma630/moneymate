import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";
import TransactionCard from "@/components/cards/TransactionCard";
import TransactionDetailsModal from "@/components/modals/TransactionDetailsModal";
import TransactionFormModal from "@/components/modals/TransactionFormModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { useTransactionsQuery } from "@/hooks/useTransactionsQuery";
import { useAppContext } from "@/context/AppContext";

export default function TransactionsSection() {
  const navigate = useNavigate();
  const { data: transactions, isLoading } = useTransactionsQuery();
  const { editTransaction, deleteTransaction, duplicateTransaction } = useAppContext();

  const [viewingTx, setViewingTx] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  return (
    <>
      <Card>
        <SectionTitle
          title="Recent Transactions"
          action={
            <button
              type="button"
              onClick={() => navigate("/expenses")}
              className="text-[11.5px] font-medium text-accent hover:underline"
            >
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

      {/* Action Modals */}
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
