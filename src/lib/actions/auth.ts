"use server"

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { LoginInput } from "@/lib/validations/auth";

export const logIn = async (data: LoginInput) => {
    try {
        await signIn("credentials", { ...data, redirectTo: "/" });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password" };
        }
        // signIn throws NEXT_REDIRECT on success — it must be rethrown
        throw error;
    }
}
