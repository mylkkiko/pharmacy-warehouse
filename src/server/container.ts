import prisma from "@/lib/prisma";
import { createPrismaBatchRepository } from "./repositories/prisma/batchRepository";
import { createPrismaMedicineRepository } from "./repositories/prisma/medicineRepository";
import { createPrismaMovementRepository } from "./repositories/prisma/movementRepository";
import { createPrismaTransactionRunner } from "./repositories/prisma/transaction";
import { createMedicineService } from "./services/medicineService";
import { createReceiptService } from "./services/receiptService";
import { createStockService } from "./services/stockService";
import { createWriteOffService } from "./services/writeOffService";

const medicineRepository = createPrismaMedicineRepository();
export const medicineService = createMedicineService(medicineRepository);

export const transactionRunner = createPrismaTransactionRunner();
export const batchRepository = createPrismaBatchRepository(prisma);
export const movementRepository = createPrismaMovementRepository(prisma);

export const receiptService = createReceiptService(transactionRunner, movementRepository);
export const stockService = createStockService(batchRepository);
export const writeOffService = createWriteOffService(transactionRunner, batchRepository);
