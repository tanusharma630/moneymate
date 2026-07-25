import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { transactionSchema } from "@/utils/schemas/transactionSchema";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";

const INCOME_CATEGORIES = ["Income", "Freelance", "Other"];
const EXPENSE_CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Other"];

/**
 * Reusable modal form for creating or editing transactions.
 * Uses React Hook Form + Zod validation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(values: import('@/utils/schemas/transactionSchema').TransactionFormValues) => void} props.onSubmit
 * @param {"income"|"expense"} [props.defaultType="income"]
 * @param {import('@/data/transactionsData').Transaction|null} [props.transactionToEdit=null]
 * @param {string} [props.title="Add Transaction"]
 */
export default function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  defaultType = "income",
  transactionToEdit = null,
  title,
}) {
  const amountInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      amount: "",
      category: defaultType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split("T")[0],
      description: "",
      method: "UPI",
      notes: "",
    },
  });

  const currentType = watch("type");

  // Reset form with appropriate defaults or transaction data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        let parsedDate = transactionToEdit.rawDate;
        if (!parsedDate) {
          parsedDate = new Date().toISOString().split("T")[0];
        }
        reset({
          type: transactionToEdit.type || defaultType,
          amount: Math.abs(transactionToEdit.amount),
          category: transactionToEdit.category || (transactionToEdit.type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
          date: parsedDate,
          description: transactionToEdit.merchant || "",
          method: transactionToEdit.method || "UPI",
          notes: transactionToEdit.notes || "",
        });
      } else {
        reset({
          type: defaultType,
          amount: "",
          category: defaultType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
          date: new Date().toISOString().split("T")[0],
          description: "",
          method: "UPI",
          notes: "",
        });
      }

      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, transactionToEdit, defaultType, reset]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleFormSubmit = async (values) => {
    await onSubmit(values);
    onClose();
  };

  const modalTitle = title || (transactionToEdit ? "Edit Transaction" : "Add Transaction");

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
            className="relative z-10 w-full max-w-[460px] rounded-card border border-border-strong bg-surface-raised p-6 shadow-glow max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[17px] font-bold tracking-tight text-text-primary">
                {modalTitle}
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

            {/* Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 rounded-lg border border-border bg-surface p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setValue("type", "income");
                    setValue("category", INCOME_CATEGORIES[0]);
                  }}
                  className={`rounded-md py-1.5 text-xs font-semibold transition-colors ${
                    currentType === "income" ? "bg-success text-bg" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue("type", "expense");
                    setValue("category", EXPENSE_CATEGORIES[0]);
                  }}
                  className={`rounded-md py-1.5 text-xs font-semibold transition-colors ${
                    currentType === "expense" ? "bg-danger text-bg" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Expense
                </button>
              </div>

              {/* Amount */}
              <FormField label="Amount (₹)" error={errors.amount?.message}>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className={inputClassName({ hasError: !!errors.amount })}
                  {...register("amount", { valueAsNumber: true })}
                  ref={(e) => {
                    register("amount").ref(e);
                    amountInputRef.current = e;
                  }}
                />
              </FormField>

              {/* Category */}
              <FormField label="Category" error={errors.category?.message}>
                <select
                  className={inputClassName({ hasError: !!errors.category })}
                  {...register("category")}
                >
                  {(currentType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Date */}
              <FormField label="Date" error={errors.date?.message}>
                <input
                  type="date"
                  className={inputClassName({ hasError: !!errors.date })}
                  {...register("date")}
                />
              </FormField>

              {/* Description */}
              <FormField label="Description / Merchant" error={errors.description?.message}>
                <input
                  type="text"
                  placeholder="e.g. Zomato, Salary payout..."
                  className={inputClassName({ hasError: !!errors.description })}
                  {...register("description")}
                />
              </FormField>

              {/* Payment Method */}
              <FormField label="Payment Method" error={errors.method?.message}>
                <select
                  className={inputClassName({ hasError: !!errors.method })}
                  {...register("method")}
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </FormField>

              {/* Notes (Optional) */}
              <FormField label="Notes (Optional)" error={errors.notes?.message}>
                <textarea
                  rows={2}
                  placeholder="Add any extra details or reference notes..."
                  className={`${inputClassName({ hasError: !!errors.notes })} py-2 resize-none`}
                  {...register("notes")}
                />
              </FormField>

              {/* Action Buttons */}
              <div className="mt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className={currentType === "income" ? "hover:bg-success/90" : "hover:bg-danger/90"}
                >
                  {isSubmitting ? "Saving..." : transactionToEdit ? "Save Changes" : "Save Transaction"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
