import { getStatusBoundaries } from "@/lib/stock";
import { NotEnoughStockError, StockChangedError } from "../errors";
import { IssueRecord, MovementRepository, TransactionRunner } from "../repositories/types";

type IssueData = {
    medicineId: string,
    quantity: number,
    note: string
}

export function createIssueService(tx: TransactionRunner, movements: MovementRepository) {
    return {
        issue: (data: IssueData, userId: string): Promise<void> => {
            const { today } = getStatusBoundaries();
            return tx.run(async (repos) => {
                const batches = await repos.batches.findAvailableForIssue(data.medicineId, today);
                const available = batches.reduce((sum, batch) => sum + batch.quantity, 0);
                if (available < data.quantity) {
                    throw new NotEnoughStockError(available);
                }
                let remaining = data.quantity;
                for (const batch of batches) {
                    if (remaining === 0) break;
                    const take = Math.min(batch.quantity, remaining);
                    const ok = await repos.batches.decrementIfEnough(batch.id, take);
                    if (!ok) {
                        throw new StockChangedError();
                    }
                    await repos.movements.create({ type: "ISSUE", quantity: take, note: data.note, batchId: batch.id, userId });
                    remaining -= take;
                }
            });
        },
        listRecent: (limit: number): Promise<IssueRecord[]> => {
            return movements.findRecentIssues(limit);
        },
        count: (): Promise<number> => {
            return movements.countIssues();
        }
    }
}
