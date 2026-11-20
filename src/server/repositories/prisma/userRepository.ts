import { Prisma } from "@/generated/prisma/client";
import { DuplicateEmailError } from "../../errors";
import { NewUser, UserRecord, UserRepository, UserUpdate } from "../types";

const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true
} satisfies Prisma.UserSelect;

function rethrowDuplicateEmail(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new DuplicateEmailError();
    }
    throw error;
}

export function createPrismaUserRepository(client: Prisma.TransactionClient): UserRepository {
    return {
        async findAll(): Promise<UserRecord[]> {
            return client.user.findMany({
                select: userSelect,
                orderBy: { createdAt: "asc" }
            });
        },
        async findById(id: string): Promise<UserRecord | null> {
            return client.user.findUnique({ where: { id }, select: userSelect });
        },
        async create(data: NewUser): Promise<void> {
            try {
                await client.user.create({ data, select: { id: true } });
            } catch (error) {
                rethrowDuplicateEmail(error);
            }
        },
        async update(id: string, data: UserUpdate): Promise<void> {
            try {
                await client.user.update({ where: { id }, data, select: { id: true } });
            } catch (error) {
                rethrowDuplicateEmail(error);
            }
        },
        async setActive(id: string, isActive: boolean): Promise<void> {
            await client.user.update({ where: { id }, data: { isActive }, select: { id: true } });
        },
        async countActiveAdmins(): Promise<number> {
            return client.user.count({ where: { role: "ADMIN", isActive: true } });
        }
    }
}
