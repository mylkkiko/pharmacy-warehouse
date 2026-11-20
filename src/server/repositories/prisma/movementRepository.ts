import { Prisma } from "@/generated/prisma/client";
import { MovementRepository, NewMovement, ReceiptRecord } from "../types";

export function createPrismaMovementRepository(client: Prisma.TransactionClient): MovementRepository {
    return {
        async create(data: NewMovement): Promise<void> {
            await client.movement.create({ data });
        },
        async findRecentReceipts(limit: number): Promise<ReceiptRecord[]> {
            const receipts = await client.movement.findMany({
                where: { type: "RECEIPT" },
                orderBy: { createdAt: "desc" },
                take: limit,
                include: {
                    batch: {
                        include: { medicine: true }
                    },
                    user: {
                        select: { name: true }
                    }
                }
            });
            return receipts.map((movement) => ({
                id: movement.id,
                date: movement.createdAt,
                medicine: movement.batch.medicine.name,
                batchNumber: movement.batch.batchNumber,
                expiryDate: movement.batch.expiryDate,
                quantity: movement.quantity,
                unit: movement.batch.medicine.unit,
                unitPrice: Number(movement.batch.unitPrice),
                receivedBy: movement.user.name
            }));
        },
        async countReceipts(): Promise<number> {
            return client.movement.count({ where: { type: "RECEIPT" } });
        }
    }
}
