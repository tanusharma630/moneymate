import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";

const AVAILABLE_ICONS = ["UtensilsCrossed", "Plane", "Receipt", "ShoppingBag", "Clapperboard", "Wallet", "CreditCard", "PiggyBank", "Sparkles"];
const TONES = [
  { value: "accent", label: "Blue" },
  { value: "success", label: "Green" },
  { value: "warning", label: "Amber" },
  { value: "danger", label: "Rose" },
];
const MONTHS_LIST = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BudgetModal() {
  const { isBudgetModalOpen, closeBudgetModal, selectedBudgetCategory, addBudgetCategory, editBudgetCategory, deleteBudgetCategory } = useAppContext();
  const nameRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      budget: "",
      icon: "ShoppingBag",
      tone: "accent",
      month: "Jul",
      notes: "",
    },
  });

  useEffect(() => {
    if (isBudgetModalOpen) {
      if (selectedBudgetCategory) {
        reset({
          name: selectedBudgetCategory.name,
          budget: selectedBudgetCategory.budget,
          icon: selectedBudgetCategory.icon || "ShoppingBag",
          tone: selectedBudgetCategory.tone || "accent",
          month: selectedBudgetCategory.month || "Jul",
          notes: selectedBudgetCategory.notes || "",
        });
      } else {
        reset({
          name: "",
          budget: "",
          icon: "ShoppingBag",
          tone: "accent",
          month: "Jul",
          notes: "",
        });
      }
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [isBudgetModalOpen, selectedBudgetCategory, reset]);

  const onFormSubmit = (data) => {
    if (selectedBudgetCategory) {
      const targetId = selectedBudgetCategory.id || selectedBudgetCategory._id;
      editBudgetCategory(targetId, data);
    } else {
      addBudgetCategory(data);
    }
    closeBudgetModal();
  };

  const handleDelete = () => {
    if (selectedBudgetCategory) {
      const targetId = selectedBudgetCategory.id || selectedBudgetCategory._id;
      deleteBudgetCategory(targetId);
      closeBudgetModal();
    }
  };

  return (
    <AnimatePresence>
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBudgetModal}
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
              <h3 className="text-[15px] font-semibold text-text-primary">
                {selectedBudgetCategory ? "Edit Budget Category" : "Create Budget Category"}
              </h3>
              <button
                type="button"
                onClick={closeBudgetModal}
                className="rounded-chip p-1 text-text-tertiary hover:bg-surface-raised hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 flex flex-col gap-4">
              <FormField label="Category Name" error={errors.name?.message}>
                <input
                  type="text"
                  placeholder="e.g. Dining Out, Subscriptions"
                  className={inputClassName({ hasError: !!errors.name })}
                  {...register("name", { required: "Category name is required" })}
                  ref={(e) => {
                    register("name").ref(e);
                    nameRef.current = e;
                  }}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Monthly Limit (₹)" error={errors.budget?.message}>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    className={inputClassName({ hasError: !!errors.budget })}
                    {...register("budget", { required: "Budget amount is required", min: { value: 1, message: "Must be greater than 0" } })}
                  />
                </FormField>

                <FormField label="Month">
                  <select className={inputClassName({})} {...register("month")}>
                    {MONTHS_LIST.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Icon">
                  <select className={inputClassName({})} {...register("icon")}>
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Color Accent">
                  <select className={inputClassName({})} {...register("tone")}>
                    {TONES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Notes / Description (Optional)">
                <textarea
                  placeholder="Additional context or budget goals..."
                  rows={2}
                  className={inputClassName({})}
                  {...register("notes")}
                />
              </FormField>

              <div className="mt-2 flex items-center justify-between pt-2">
                {selectedBudgetCategory ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleDelete} className="text-danger hover:bg-danger-soft">
                    Delete
                  </Button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" size="md" onClick={closeBudgetModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                    {selectedBudgetCategory ? "Save Changes" : "Create Budget"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

