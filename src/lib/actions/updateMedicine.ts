"use server"

import { auth } from "@/lib/auth";
import { MedicineInput, medicineSchema } from "@/lib/validations/medicine";
import { medicineService } from "@/server/container";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateMedicine(id: string, data: MedicineInput) {
    const session = await auth();
    if(!session?.user) {
        return { error: "Unauthorized" };
    }
    const parsed = medicineSchema.safeParse(data);
    if(!parsed.success) {
        return { error: "Invalid data" };
    }
    try {
        await medicineService.update(id, parsed.data);
    } catch {
        return { error: "Could not update medicine" };
    }
    revalidatePath("/medicines");
    redirect("/medicines");
}