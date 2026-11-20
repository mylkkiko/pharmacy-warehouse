"use server"

import { auth } from "@/lib/auth";
import { CreateUserInput, UpdateUserInput, createUserSchema, updateUserSchema } from "@/lib/validations/user";
import { userService } from "@/server/container";
import { CannotDeactivateSelfError, DuplicateEmailError, LastAdminError, UserNotFoundError } from "@/server/errors";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const USERS_PATH = "/admin/users";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return null;
    }
    return session;
}

function knownErrorMessage(error: unknown): string | null {
    if (
        error instanceof DuplicateEmailError ||
        error instanceof UserNotFoundError ||
        error instanceof CannotDeactivateSelfError ||
        error instanceof LastAdminError
    ) {
        return error.message;
    }
    return null;
}

export async function createUser(data: CreateUserInput) {
    if (!await requireAdmin()) {
        return { error: "Forbidden" };
    }
    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
        return { error: "Invalid data" };
    }
    try {
        await userService.create(parsed.data);
    } catch (error) {
        return { error: knownErrorMessage(error) ?? "Could not create user" };
    }
    revalidatePath(USERS_PATH);
    redirect(USERS_PATH);
}

export async function updateUser(id: string, data: UpdateUserInput) {
    if (!await requireAdmin()) {
        return { error: "Forbidden" };
    }
    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
        return { error: "Invalid data" };
    }
    try {
        await userService.update(id, parsed.data);
    } catch (error) {
        return { error: knownErrorMessage(error) ?? "Could not update user" };
    }
    revalidatePath(USERS_PATH);
    redirect(USERS_PATH);
}

export async function deactivateUser(id: string) {
    const session = await requireAdmin();
    if (!session) {
        return { error: "Forbidden" };
    }
    try {
        await userService.deactivate(id, session.user.id);
    } catch (error) {
        return { error: knownErrorMessage(error) ?? "Could not deactivate user" };
    }
    revalidatePath(USERS_PATH);
    return { success: true };
}

export async function activateUser(id: string) {
    if (!await requireAdmin()) {
        return { error: "Forbidden" };
    }
    try {
        await userService.activate(id);
    } catch (error) {
        return { error: knownErrorMessage(error) ?? "Could not activate user" };
    }
    revalidatePath(USERS_PATH);
    return { success: true };
}
