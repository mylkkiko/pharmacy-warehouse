"use server"

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import type { LoginInput } from "@/lib/validations/auth";

export async function logIn(data: LoginInput) {
    try {
        await signIn("credentials", { email: data.email, password: data.password, redirectTo: "/" });
    } catch(error) {
        if(error instanceof AuthError) {
            return { error: "Invalid email or password" }
        } 
        throw error;
    }
}