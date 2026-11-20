"use server"

import { auth } from "@/lib/auth";
import { MedicineInput, medicineSchema } from "@/lib/validations/medicine";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { medicineService } from "@/server/container";

export async function createMedicine(data: MedicineInput) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" }
    }
    const parsed = medicineSchema.safeParse(data);
    if (!parsed.success) {
        return { error: "Invalid data" };
    }
    try {
        await medicineService.create(parsed.data);
    } catch {
        return { error: "Could not create medicine" }
    }
    revalidatePath("/medicines");
    redirect("/medicines");
}