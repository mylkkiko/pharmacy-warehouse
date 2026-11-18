import * as z from "zod";

export const MEDICINE_FORMS = ["Capsules", "Powder for injection", "Tablets", "Solution for injection", "Solution for infusion"]
export const MEDICINE_UNITS = ["pcs", "vials", "ampoules", "bottles"]

export const medicineSchema = z.object({
    name: z.string().min(1, { error: "Name is required" }),
    activeIngredient: z.string().min(1, { error: "Active ingredient is required" }),
    form: z.enum(MEDICINE_FORMS, { error: "Select a form" }),
    dosage: z.string().min(1, { error: "Dosage is required" }),
    unit: z.enum(MEDICINE_UNITS, { error: "Select a unit" }),
    minStock: z.number({ error: "Min stock is required" }).int({ error: "Min stock must be a whole number" }).min(0, { error: "Min stock must be 0 or more" })
});

export type MedicineInput = z.infer<typeof medicineSchema>;