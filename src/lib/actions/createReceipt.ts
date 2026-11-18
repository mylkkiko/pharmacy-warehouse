"use server"

import { auth } from "@/lib/auth";
import { ReceiptInput, receiptSchema } from "@/lib/validations/receipt";
import { Prisma }  from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReceipt(data: ReceiptInput) {
    const session = await auth();
    if(!session?.user) {
        return { error: "Unauthorized" }
    }
    const userId = session.user.id;
    const parsed = receiptSchema.safeParse(data);
    if(!parsed.success) {
        return { error: "Invalid data" };
    }
    const { quantity } = parsed.data;
    try {
        await prisma.$transaction(async(tx) => {
            const batch = await tx.batch.create({ data: parsed.data});
            await tx.movement.create({ data: { type: "RECEIPT", quantity, batchId: batch.id, userId } })
        });
    } catch(error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "Batch with this number already exists for this medicine" }
        }
        return { error: "Could not create receipt" }
    }
    revalidatePath("/receipts");
    revalidatePath("/medicines");
    return { success: true }
}