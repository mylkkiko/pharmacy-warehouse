import { Prisma } from "@/generated/prisma/client";
import { IssueRecord, MovementRecord, MovementRepository, NewMovement, ReceiptRecord } from "../types";

const receiptInclude = {
    batch: {
        include: { medicine: true }
    },
    user: {
        select: { name: true }
    }
} satisfies Prisma.MovementInclude;

type ReceiptMovement = Prisma.MovementGetPayload<{ include: typeof receiptInclude }>;

function toReceiptRecord(movement: ReceiptMovement): ReceiptRecord {
    return {
        id: movement.id,
        date: movement.createdAt,
        medicine: movement.batch.medicine.name,
        batchNumber: movement.batch.batchNumber,
        expiryDate: movement.batch.expiryDate,
        quantity: movement.quantity,
        unit: movement.batch.medicine.unit,
        unitPrice: Number(movement.batch.unitPrice),
        receivedBy: movement.user.name
    };
}

function createdBetween(from: Date | null, to: Date | null): Prisma.DateTimeFilter | undefined {
    if (!from && !to) {
        return undefined;
    }
    return { ...(from && { gte: from }), ...(to && { lte: to }) };
}


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
                include: receiptInclude
            });
            return receipts.map(toReceiptRecord);
        },
        async countReceipts(): Promise<number> {
            return client.movement.count({ where: { type: "RECEIPT" } });
        },
        async findRecentIssues(limit: number): Promise<IssueRecord[]> {
            const issues = await client.movement.findMany({
                where: { type: "ISSUE" },
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
            return issues.map((movement) => ({
                id: movement.id,
                date: movement.createdAt,
                medicine: movement.batch.medicine.name,
                batchNumber: movement.batch.batchNumber,
                quantity: movement.quantity,
                unit: movement.batch.medicine.unit,
                note: movement.note,
                issuedBy: movement.user.name
            }));
        },
        async countIssues(): Promise<number> {
            return client.movement.count({ where: { type: "ISSUE" } });
        },
        async findAll(limit: number): Promise<MovementRecord[]> {
            const movements = await client.movement.findMany({
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
            return movements.map((movement) => ({
                id: movement.id,
                date: movement.createdAt,
                type: movement.type,
                medicine: movement.batch.medicine.name,
                batchNumber: movement.batch.batchNumber,
                quantity: movement.quantity,
                unit: movement.batch.medicine.unit,
                user: movement.user.name,
                note: movement.note
            }));
        },
        async findReceiptsBetween(from: Date | null, to: Date | null): Promise<ReceiptRecord[]> {
            const receipts = await client.movement.findMany({
                where: { type: "RECEIPT", createdAt: createdBetween(from, to) },
                orderBy: { createdAt: "desc" },
                include: receiptInclude
            });
            return receipts.map(toReceiptRecord);
        },
        async sumWriteOffValueBetween(from: Date | null, to: Date | null): Promise<number> {
            const writeOffs = await client.movement.findMany({
                where: { type: "WRITE_OFF", createdAt: createdBetween(from, to) },
                select: {
                    quantity: true,
                    batch: { select: { unitPrice: true } }
                }
            });
            return writeOffs.reduce((sum, movement) => sum + movement.quantity * Number(movement.batch.unitPrice), 0);
        }
    }
}
