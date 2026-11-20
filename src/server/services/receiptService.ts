import { MovementRepository, NewBatch, ReceiptRecord, TransactionRunner } from "../repositories/types";

export function createReceiptService(tx: TransactionRunner, movements: MovementRepository) {
    return {
        create: (data: NewBatch, userId: string): Promise<void> => {
            return tx.run(async (repos) => {
                const batchId = await repos.batches.create(data);
                await repos.movements.create({ type: "RECEIPT", quantity: data.quantity, batchId, userId });
            });
        },
        listRecent: (limit: number): Promise<ReceiptRecord[]> => {
            return movements.findRecentReceipts(limit);
        },
        count: (): Promise<number> => {
            return movements.countReceipts();
        }
    }
}
