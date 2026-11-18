"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MedicineInput, medicineSchema } from "@/lib/validations/medicine";
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
        await prisma.medicine.update({ where: { id }, data: parsed.data } );
    } catch {
        return { error: "Could not update medicine" };
    }
    revalidatePath("/medicines");
    redirect("/medicines");
}