import { z } from "zod";

/**
 * Validation schema for the Quick Add Transaction form.
 */
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .number({ invalid_type_error: "Amount is required and must be a number" })
    .positive("Amount must be greater than zero"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().trim().min(1, "Description is required"),
  method: z.string().optional(),
  notes: z.string().optional(),
});

/** @typedef {z.infer<typeof transactionSchema>} TransactionFormValues */
