import { Prisma } from "@/generated/prisma/client";
import { DuplicateBatchError } from "../../errors";
import { BatchRecord, BatchRepository, NewBatch, StockFilter, StockRecord } from "../types";

export function createPrismaBatchRepository(client: Prisma.TransactionClient): BatchRepository {
    return {
        async create(data: NewBatch): Promise<string> {
            try {
                const batch = await client.batch.create({ data, select: { id: true } });
                return batch.id;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                    throw new DuplicateBatchError();
                }
                throw error;
            }
        },
        async findById(id: string): Promise<BatchRecord | null> {
            return client.batch.findUnique({
                where: { id },
                select: {
                    id: true,
                    medicineId: true,
                    batchNumber: true,
                    expiryDate: true,
                    quantity: true
                }
            });
        },
        async findForStock(filter: StockFilter): Promise<StockRecord[]> {
            const { search, status, today, soon } = filter;
            const where: Prisma.BatchWhereInput = { quantity: { gt: 0 } };
            if (search) {
                where.medicine = { name: { contains: search, mode: "insensitive" } }
            }
            if (status === "expired") {
                where.expiryDate = { lt: today }
            } else if (status === "expiring") {
                where.expiryDate = { gte: today, lte: soon }
            } else if (status === "ok") {
                where.expiryDate = { gt: soon }
            }
            const batches = await client.batch.findMany({
                where,
                include: {
                    medicine: true,
                },
                orderBy: {
                    expiryDate: "asc"
                }
            });
            return batches.map((batch) => ({
                id: batch.id,
                medicine: batch.medicine.name,
                dosage: batch.medicine.dosage,
                batchNumber: batch.batchNumber,
                quantity: batch.quantity,
                supplier: batch.supplier,
                receivedAt: batch.receivedAt,
                expiryDate: batch.expiryDate,
                unit: batch.medicine.unit
            }));
        },
        async setQuantity(id: string, quantity: number): Promise<void> {
            await client.batch.update({ where: { id }, data: { quantity } });
        },
        async findAvailableForIssue(medicineId: string, from: Date): Promise<BatchRecord[]> {
            return client.batch.findMany({
                where: {
                    medicineId,
                    quantity: { gt: 0 },
                    expiryDate: { gte: from }
                },
                orderBy: { expiryDate: "asc" },
                select: {
                    id: true,
                    medicineId: true,
                    batchNumber: true,
                    expiryDate: true,
                    quantity: true
                }
            });
        },
        async decrementIfEnough(id: string, amount: number): Promise<boolean> {
            const result = await client.batch.updateMany({
                where: { id, quantity: { gte: amount } },
                data: { quantity: { decrement: amount } }
            });
            return result.count > 0;
        }
    }
}
