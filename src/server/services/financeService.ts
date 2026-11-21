import dayjs from "dayjs";
import { FinanceSummary, MovementRepository } from "../repositories/types";

export type FinancePeriod = "month" | "last-month" | "all";

export const FINANCE_PERIODS: FinancePeriod[] = ["month", "last-month", "all"];

function getRange(period: FinancePeriod): { from: Date | null, to: Date | null } {
    if (period === "month") {
        const now = dayjs();
        return { from: now.startOf("month").toDate(), to: now.endOf("month").toDate() };
    }
    if (period === "last-month") {
        const lastMonth = dayjs().subtract(1, "month");
        return { from: lastMonth.startOf("month").toDate(), to: lastMonth.endOf("month").toDate() };
    }
    return { from: null, to: null };
}

export function createFinanceService(movements: MovementRepository) {
    return {
        getSummary: async (period: FinancePeriod): Promise<FinanceSummary> => {
            const { from, to } = getRange(period);
            const [receiptRecords, writeOffLoss] = await Promise.all([
                movements.findReceiptsBetween(from, to),
                movements.sumWriteOffValueBetween(from, to)
            ]);
            const receipts = receiptRecords.map((receipt) => ({
                ...receipt,
                total: receipt.quantity * receipt.unitPrice
            }));
            const totalSpent = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
            return { totalSpent, receiptsCount: receipts.length, writeOffLoss, receipts };
        }
    }
}
