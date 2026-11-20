import { getStatusBoundaries } from "@/lib/stock";
import { BatchRepository, MedicineRepository, MedicineWithStock, StockRecord } from "../repositories/types";

export type DashboardSummary = {
    lowStock: MedicineWithStock[],
    expiringSoon: StockRecord[],
    expired: StockRecord[]
}

export function createDashboardService(medicines: MedicineRepository, batches: BatchRepository) {
    return {
        getSummary: async (): Promise<DashboardSummary> => {
            const { today, soon } = getStatusBoundaries();
            const [allMedicines, expiringSoon, expired] = await Promise.all([
                medicines.findMany(""),
                batches.findForStock({ search: "", status: "expiring", today, soon }),
                batches.findForStock({ search: "", status: "expired", today, soon })
            ]);
            const lowStock = allMedicines.filter((medicine) => medicine.stock < medicine.minStock);
            return { lowStock, expiringSoon, expired };
        }
    }
}
