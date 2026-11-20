import { auth } from "@/lib/auth";
import { IssueInput, issueSchema } from "@/lib/validations/issue";
import { getStatusBoundaries } from "@/lib/stock";
import prisma from "@/lib/prisma";

export async function issueMedicine(data: IssueInput) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
    const userId = session.user.id;
    const parsed = issueSchema.safeParse(data);
    if(!parsed.success) {
        return { error: "Invalid data" }
    }
    const { medicineId, quantity, note } = parsed.data;
    const { today } = getStatusBoundaries();
    try { 
        await prisma.$transaction(async(tx) => {
            tx.batch.findMany({
                where: {
                    medicineId,
                    quantity: { gt: 0 },
                    expiryDate: { gte: today }
                }, 
                orderBy: {
                    expiryDate: "asc"
                }
            })
        })
    } catch {

    }
}