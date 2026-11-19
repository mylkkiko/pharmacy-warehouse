"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBatchStatus } from "@/lib/stock";
import { revalidatePath } from "next/cache";

export async function writeOffBatch(batchId: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
    const batch = await prisma.batch.findUnique({
        where: { id: batchId }
    });
    if (!batch) {
        return { error: "Batch not found" }
    }
    if(batch.quantity <= 0) {
        return { error: "Batch is already empty" }
    }
    const batchStatus = getBatchStatus(batch.expiryDate);
    if(batchStatus !== "EXPIRED") {
        return { error: "Only expired batches can be written off" }
    }
    try {
        await prisma.$transaction(async(tx) => {
            await tx.movement.create({
                data: {
                    type: "WRITE_OFF",
                    quantity: batch.quantity, 
                    note: "expired",
                    batchId,
                    userId: session.user.id
                }
            });
            await tx.batch.update({
                where: { id: batchId },
                data: { quantity: 0 }
            })
        })
    } catch {
        return { error: "Could not write off batch" }
    }
    revalidatePath("/stock");
    revalidatePath("/medicines");
    revalidatePath("/movements");
    revalidatePath("/");
    return { success: true }
}