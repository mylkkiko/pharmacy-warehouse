import { getBatchStatus } from "@/lib/stock";
import { StockChangedError } from "../errors";
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
                const ok = await repos.batches.decrementIfEnough(batchId, batch.quantity);
                if (!ok) {
                    throw new StockChangedError();
                }
                await repos.movements.create({ type: "WRITE_OFF", quantity: batch.quantity, note: "Expired", batchId, userId });
            });
            return { success: true };
        }
    }
}
