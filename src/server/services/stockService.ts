import { BatchStatus, getBatchStatus, getStatusBoundaries } from "@/lib/stock";
import { BatchRepository, StockFilter, StockRecord } from "../repositories/types";

const STATUSES: StockFilter["status"][] = ["all", "expired", "expiring", "ok"];

function normalizeStatus(status: string): StockFilter["status"] {
    return STATUSES.find((value) => value === status) ?? "all";
}

export function createStockService(batches: BatchRepository) {
    return {
        list: async (search: string, status: string): Promise<(StockRecord & { status: BatchStatus })[]> => {
            const { today, soon } = getStatusBoundaries();
            const records = await batches.findForStock({ search, status: normalizeStatus(status), today, soon });
            return records.map((record) => ({ ...record, status: getBatchStatus(record.expiryDate) }));
        }
    }
}
