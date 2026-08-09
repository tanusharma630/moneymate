import { z } from "zod";

/**
 * Validation schema for the Settings > Profile form. Shared between the
 * form component (via zodResolver) and, later, the backend request handler.
 */
export const profileSettingsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  monthlySavingsTarget: z
    .number({ invalid_type_error: "Enter a number" })
    .positive("Target must be greater than zero"),
  currency: z.enum(["INR", "USD", "EUR"]),
  notifyBudgetAlerts: z.boolean(),
});

/** @typedef {z.infer<typeof profileSettingsSchema>} ProfileSettingsFormValues */
