import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/common/SectionTitle";
import FormField, { inputClassName } from "@/components/forms/FormField";
import { profileSettingsSchema } from "@/utils/schemas/profileSchema";
import { useAppContext } from "@/context/AppContext";

/**
 * Profile settings form: name, email, monthly savings target, currency, and
 * a budget-alerts toggle. Validated with Zod via react-hook-form's resolver.
 * Submission calls updateProfile() in AppContext to update the sidebar + navbar immediately.
 */
export default function ProfileSettingsForm() {
  const { profile, updateProfile } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: profile.name,
      email: "anvi@example.com",
      monthlySavingsTarget: 30000,
      currency: "INR",
      notifyBudgetAlerts: true,
    },
  });

  const onSubmit = async (values) => {
    // Simulate async persistence (swap for API call once backend exists)
    await new Promise((resolve) => setTimeout(resolve, 400));
    localStorage.setItem("moneymate_profile", JSON.stringify(values));
    // Update global Context so Navbar & Sidebar reflect changes instantly
    updateProfile(values);
  };

  return (
    <Card>
      <SectionTitle title="Profile" subtitle="Your personal details and preferences." />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Full name" error={errors.name?.message}>
            <input
              type="text"
              className={inputClassName({ hasError: !!errors.name })}
              {...register("name")}
            />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <input
              type="email"
              className={inputClassName({ hasError: !!errors.email })}
              {...register("email")}
            />
          </FormField>

          <FormField label="Monthly savings target" error={errors.monthlySavingsTarget?.message}>
            <input
              type="number"
              className={inputClassName({ hasError: !!errors.monthlySavingsTarget })}
              {...register("monthlySavingsTarget", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Currency" error={errors.currency?.message}>
            <select className={inputClassName({ hasError: !!errors.currency })} {...register("currency")}>
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </FormField>
        </div>

        <label className="flex items-center gap-2.5 text-[12.5px] text-text-secondary">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-accent"
            {...register("notifyBudgetAlerts")}
          />
          Notify me when a budget category is close to its limit
        </label>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
          {isSubmitSuccessful && !isSubmitting && (
            <span className="flex items-center gap-1 text-[12px] text-success">
              <Check size={13} /> Saved
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}
