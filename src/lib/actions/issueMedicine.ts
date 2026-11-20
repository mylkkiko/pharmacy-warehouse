"use server"

import { auth } from "@/lib/auth";
import { IssueInput, issueSchema } from "@/lib/validations/issue";
import { issueService } from "@/server/container";
import { NotEnoughStockError, StockChangedError } from "@/server/errors";
import { revalidatePath } from "next/cache";

export async function issueMedicine(data: IssueInput) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
    const parsed = issueSchema.safeParse(data);
    if (!parsed.success) {
        return { error: "Invalid data" };
    }
    try {
        await issueService.issue(parsed.data, session.user.id);
    } catch (error) {
        if (error instanceof NotEnoughStockError || error instanceof StockChangedError) {
            return { error: error.message };
        }
        return { error: "Could not issue medicine" };
    }
    revalidatePath("/issue");
    revalidatePath("/stock");
    revalidatePath("/medicines");
    revalidatePath("/movements");
    revalidatePath("/");
    return { success: true };
}
