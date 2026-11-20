import { getBatchStatus } from "@/lib/stock";
import { BatchRepository, TransactionRunner } from "../repositories/types";

export function createWriteOffService(tx: TransactionRunner, batches: BatchRepository) {
    return {
        writeOff: async (batchId: string, userId: string): Promise<{ error: string } | { success: true }> => {
            const batch = await batches.findById(batchId);
            if (!batch) {
                return { error: "Batch not found" };
            }
            if (batch.quantity <= 0) {
                return { error: "Batch is already empty" };
            }
            if (getBatchStatus(batch.expiryDate) !== "EXPIRED") {
                return { error: "Only expired batches can be written off" };
            }
            await tx.run(async (repos) => {
                await repos.movements.create({ type: "WRITE_OFF", quantity: batch.quantity, note: "Expired", batchId, userId });
                await repos.batches.setQuantity(batchId, 0);
            });
            return { success: true };
        }
    }
}
