import { useAppContext } from "@/context/AppContext";
import TransactionFormModal from "@/components/modals/TransactionFormModal";

export default function QuickAddModal() {
  const { isQuickAddOpen, quickAddType, closeQuickAdd, addTransaction } = useAppContext();

  return (
    <TransactionFormModal
      isOpen={isQuickAddOpen}
      onClose={closeQuickAdd}
      onSubmit={(values) => addTransaction(values)}
      defaultType={quickAddType}
      title="Add Transaction"
    />
  );
}
