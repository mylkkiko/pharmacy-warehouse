import bcrypt from "bcryptjs";
import { CannotDeactivateSelfError, LastAdminError, UserNotFoundError } from "../errors";
import { UserRecord, UserRepository, UserRole, UserUpdate } from "../repositories/types";

const BCRYPT_COST = 10;

type CreateUserData = {
    name: string,
    email: string,
    password: string,
    role: UserRole
}

type UpdateUserData = {
    name: string,
    email: string,
    password?: string,
    role: UserRole
}

export function createUserService(users: UserRepository) {
    const isLastActiveAdmin = async (user: UserRecord): Promise<boolean> => {
        if (user.role !== "ADMIN" || !user.isActive) {
            return false;
        }
        return (await users.countActiveAdmins()) <= 1;
    };

    return {
        list: (): Promise<UserRecord[]> => {
            return users.findAll();
        },
        getById: (id: string): Promise<UserRecord | null> => {
            return users.findById(id);
        },
        create: async (data: CreateUserData): Promise<void> => {
            const passwordHash = await bcrypt.hash(data.password, BCRYPT_COST);
            await users.create({ name: data.name, email: data.email, role: data.role, passwordHash });
        },
        update: async (id: string, data: UpdateUserData): Promise<void> => {
            const user = await users.findById(id);
            if (!user) {
                throw new UserNotFoundError();
            }
            if (data.role !== "ADMIN" && await isLastActiveAdmin(user)) {
                throw new LastAdminError();
            }
            const update: UserUpdate = { name: data.name, email: data.email, role: data.role };
            if (data.password) {
                update.passwordHash = await bcrypt.hash(data.password, BCRYPT_COST);
            }
            await users.update(id, update);
        },
        deactivate: async (id: string, currentUserId: string): Promise<void> => {
            if (id === currentUserId) {
                throw new CannotDeactivateSelfError();
            }
            const user = await users.findById(id);
            if (!user) {
                throw new UserNotFoundError();
            }
            if (await isLastActiveAdmin(user)) {
                throw new LastAdminError();
            }
            await users.setActive(id, false);
        },
        activate: async (id: string): Promise<void> => {
            const user = await users.findById(id);
            if (!user) {
                throw new UserNotFoundError();
            }
            await users.setActive(id, true);
        }
    }
}
