"use server"

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { LoginInput } from "@/lib/validations/auth";

export const auth = async (data: LoginInput) => {
    try {
        await signIn("credentials", { ...data, redirectTo: "/" });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password" };
        }
        throw error;
    }
}

export const logOut = async () => {
    await signOut({ redirectTo: "/login" });
}
