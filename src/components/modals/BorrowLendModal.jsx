import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";

export default function BorrowLendModal() {
  const { isBorrowLendModalOpen, closeBorrowLendModal, addBorrowLendRecord } = useAppContext();
  const personRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      person: "",
      type: "lent",
      amount: "",
      dueDate: "Next month",
      notes: "",
    },
  });

  useEffect(() => {
    if (isBorrowLendModalOpen) {
      reset({
        person: "",
        type: "lent",
        amount: "",
        dueDate: "Next month",
        notes: "",
      });
      setTimeout(() => personRef.current?.focus(), 50);
    }
  }, [isBorrowLendModalOpen, reset]);

  const onFormSubmit = (data) => {
    addBorrowLendRecord(data);
    closeBorrowLendModal();
  };

  return (
    <AnimatePresence>
      {isBorrowLendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBorrowLendModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-md overflow-hidden rounded-card border border-border bg-surface p-5 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-[15px] font-semibold text-text-primary">Add Borrow / Lend Record</h3>
              <button
                type="button"
                onClick={closeBorrowLendModal}
                className="rounded-chip p-1 text-text-tertiary hover:bg-surface-raised hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 flex flex-col gap-4">
              <FormField label="Person Name" error={errors.person?.message}>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className={inputClassName({ hasError: !!errors.person })}
                  {...register("person", { required: "Person name is required" })}
                  ref={(e) => {
                    register("person").ref(e);
                    personRef.current = e;
                  }}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Type">
                  <select className={inputClassName({})} {...register("type")}>
                    <option value="lent">I Lent (Money Owed to Me)</option>
                    <option value="borrowed">I Borrowed (Money I Owe)</option>
                  </select>
                </FormField>

                <FormField label="Amount (₹)" error={errors.amount?.message}>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    className={inputClassName({ hasError: !!errors.amount })}
                    {...register("amount", { required: "Amount is required", min: { value: 1, message: "Must be > 0" } })}
                  />
                </FormField>
              </div>

              <FormField label="Expected Due Date">
                <input
                  type="text"
                  placeholder="e.g. Aug 15 or Next week"
                  className={inputClassName({})}
                  {...register("dueDate")}
                />
              </FormField>

              <FormField label="Notes (Optional)">
                <input
                  type="text"
                  placeholder="e.g. Split for dinner / trip"
                  className={inputClassName({})}
                  {...register("notes")}
                />
              </FormField>

              <div className="mt-2 flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" size="md" onClick={closeBorrowLendModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  Save Record
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
