"use server"

import { auth } from "@/lib/auth";
import { ReceiptInput, receiptSchema } from "@/lib/validations/receipt";
import { DuplicateBatchError } from "@/server/errors";
import { receiptService } from "@/server/container";
import { revalidatePath } from "next/cache";

export async function createReceipt(data: ReceiptInput) {
    const session = await auth();
    if(!session?.user) {
        return { error: "Unauthorized" }
    }
    const parsed = receiptSchema.safeParse(data);
    if(!parsed.success) {
        return { error: "Invalid data" };
    }
    try {
        await receiptService.create(parsed.data, session.user.id);
    } catch(error) {
        if(error instanceof DuplicateBatchError) {
            return { error: error.message }
        }
        return { error: "Could not create receipt" }
    }
    revalidatePath("/receipts");
    revalidatePath("/medicines");
    return { success: true }
}