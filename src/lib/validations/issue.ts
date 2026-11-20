import { z } from "zod";

export const issueSchema = z.object({
    medicineId: z.string().min(1, { error: "Select a medicine" }),
    quantity: z.number({ error: "Quantity is required" }).int({ error: "Quantity must be a whole number" }).min(1, { error: "Quantity must be at least 1" }),
    note: z.string().min(1, { error: "Specify who receives the medicine" })
});

export type IssueInput = z.infer<typeof issueSchema>;