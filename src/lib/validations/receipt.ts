import { z } from "zod";

export const receiptSchema = z.object({
    medicineId: z.string().min(1, { error: "Select a medicine" }),
    batchNumber: z.string().min(1, { error: "Batch number is required" }),
    expiryDate: z.date({ error: "Expiry date is required" }).refine((date) => date > new Date(), { error: "Expiry date must be in the future" }),
    quantity: z.number({ error: "Quantity is required" }).int({ error: "Quantity must be a whole number" }).min(1, { error: "Quantity must be at least 1" }),
    unitPrice: z.number({ error: "Unit price is required" }).positive({ error: "Unit price must be greater than 0" }),
    supplier: z.string().optional()
});

export type ReceiptInput = z.infer<typeof receiptSchema>;