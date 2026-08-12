import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";

const GOAL_ICONS = ["Laptop", "Umbrella", "ShieldCheck", "Car", "Plane", "Home", "GraduationCap", "Target"];
const PRIORITIES = ["High", "Medium", "Low"];

export default function GoalModal() {
  const { isGoalModalOpen, closeGoalModal, selectedGoal, goalModalMode, addSavingsGoal, editSavingsGoal, depositToGoal, deleteGoal } = useAppContext();
  const titleRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      target: "",
      saved: "0",
      depositAmount: "",
      category: "Personal",
      targetDate: "Dec 2026",
      icon: "Target",
      priority: "Medium",
      notes: "",
    },
  });

  useEffect(() => {
    if (isGoalModalOpen) {
      if (goalModalMode === "deposit" && selectedGoal) {
        reset({
          depositAmount: "",
        });
      } else if (selectedGoal) {
        reset({
          title: selectedGoal.title || selectedGoal.name,
          target: selectedGoal.target,
          saved: selectedGoal.saved,
          category: selectedGoal.category || "Personal",
          targetDate: selectedGoal.targetDate || "Dec 2026",
          icon: selectedGoal.icon || "Target",
          priority: selectedGoal.priority || "Medium",
          notes: selectedGoal.notes || "",
        });
      } else {
        reset({
          title: "",
          target: "",
          saved: "0",
          depositAmount: "",
          category: "Personal",
          targetDate: "Dec 2026",
          icon: "Target",
          priority: "Medium",
          notes: "",
        });
      }
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isGoalModalOpen, selectedGoal, goalModalMode, reset]);

  const onFormSubmit = (data) => {
    const targetId = selectedGoal ? (selectedGoal.id || selectedGoal._id) : null;
    if (goalModalMode === "deposit" && selectedGoal) {
      depositToGoal(targetId, data.depositAmount);
    } else if (selectedGoal) {
      editSavingsGoal(targetId, data);
    } else {
      addSavingsGoal(data);
    }
    closeGoalModal();
  };

  const handleDelete = () => {
    if (selectedGoal) {
      const targetId = selectedGoal.id || selectedGoal._id;
      deleteGoal(targetId);
      closeGoalModal();
    }
  };

  return (
    <AnimatePresence>
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGoalModal}
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
                {goalModalMode === "deposit"
                  ? `Deposit to ${selectedGoal?.title || selectedGoal?.name}`
                  : selectedGoal
                  ? "Edit Savings Goal"
                  : "Create Savings Goal"}
              </h3>
              <button
                type="button"
                onClick={closeGoalModal}
                className="rounded-chip p-1 text-text-tertiary hover:bg-surface-raised hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 flex flex-col gap-4">
              {goalModalMode === "deposit" ? (
                <FormField label="Deposit Amount (₹)" error={errors.depositAmount?.message}>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    className={inputClassName({ hasError: !!errors.depositAmount })}
                    {...register("depositAmount", { required: "Deposit amount is required", min: { value: 1, message: "Must be > 0" } })}
                    ref={(e) => {
                      register("depositAmount").ref(e);
                      titleRef.current = e;
                    }}
                  />
                </FormField>
              ) : (
                <>
                  <FormField label="Goal Title" error={errors.title?.message}>
                    <input
                      type="text"
                      placeholder="e.g. Emergency Fund, New Macbook"
                      className={inputClassName({ hasError: !!errors.title })}
                      {...register("title", { required: "Goal title is required" })}
                      ref={(e) => {
                        register("title").ref(e);
                        titleRef.current = e;
                      }}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Target Amount (₹)" error={errors.target?.message}>
                      <input
                        type="number"
                        placeholder="e.g. 100000"
                        className={inputClassName({ hasError: !!errors.target })}
                        {...register("target", { required: "Target amount is required" })}
                      />
                    </FormField>

                    <FormField label="Current Saved (₹)">
                      <input
                        type="number"
                        placeholder="0"
                        className={inputClassName({})}
                        {...register("saved")}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Target Date">
                      <input
                        type="text"
                        placeholder="Dec 2026"
                        className={inputClassName({})}
                        {...register("targetDate")}
                      />
                    </FormField>

                    <FormField label="Priority">
                      <select className={inputClassName({})} {...register("priority")}>
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Icon">
                      <select className={inputClassName({})} {...register("icon")}>
                        {GOAL_ICONS.map((ic) => (
                          <option key={ic} value={ic}>
                            {ic}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Notes / Reason (Optional)">
                    <textarea
                      placeholder="Why you are saving for this goal..."
                      rows={2}
                      className={inputClassName({})}
                      {...register("notes")}
                    />
                  </FormField>
                </>
              )}

              <div className="mt-2 flex items-center justify-between pt-2">
                {selectedGoal && goalModalMode !== "deposit" ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleDelete} className="text-danger hover:bg-danger-soft">
                    Delete
                  </Button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" size="md" onClick={closeGoalModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                    {goalModalMode === "deposit" ? "Confirm Deposit" : selectedGoal ? "Save Changes" : "Create Goal"}
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

