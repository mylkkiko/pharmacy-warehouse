import prisma from "@/lib/prisma";
import { Repositories, TransactionRunner } from "../types";
import { createPrismaBatchRepository } from "./batchRepository";
import { createPrismaMovementRepository } from "./movementRepository";

export function createPrismaTransactionRunner(): TransactionRunner {
    return {
        run<T>(fn: (repos: Repositories) => Promise<T>): Promise<T> {
            return prisma.$transaction(async (tx) => fn({
                batches: createPrismaBatchRepository(tx),
                movements: createPrismaMovementRepository(tx)
            }));
        }
    }
}
