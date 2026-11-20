import prisma from "@/lib/prisma";
import { createPrismaBatchRepository } from "./repositories/prisma/batchRepository";
import { createPrismaMedicineRepository } from "./repositories/prisma/medicineRepository";
import { createPrismaMovementRepository } from "./repositories/prisma/movementRepository";
import { createPrismaTransactionRunner } from "./repositories/prisma/transaction";
import { createDashboardService } from "./services/dashboardService";
import { createIssueService } from "./services/issueService";
import { createMedicineService } from "./services/medicineService";
import { createMovementService } from "./services/movementService";
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
export const issueService = createIssueService(transactionRunner, movementRepository);
export const movementService = createMovementService(movementRepository);
export const dashboardService = createDashboardService(medicineRepository, batchRepository);
