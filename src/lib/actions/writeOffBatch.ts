"use server"

import { auth } from "@/lib/auth";
import { writeOffService } from "@/server/container";
import { revalidatePath } from "next/cache";

export async function writeOffBatch(batchId: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
    let result;
    try {
        result = await writeOffService.writeOff(batchId, session.user.id);
    } catch {
        return { error: "Could not write off batch" }
    }
    if ("error" in result) {
        return { error: result.error }
    }
    revalidatePath("/stock");
    revalidatePath("/medicines");
    revalidatePath("/movements");
    revalidatePath("/");
    return { success: true }
}
