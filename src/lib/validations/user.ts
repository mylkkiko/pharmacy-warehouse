import * as z from "zod";

export const USER_ROLES = [
    { value: "ADMIN", label: "Admin" },
    { value: "PHARMACIST", label: "Pharmacist" },
];

const baseUserSchema = z.object({
    name: z.string().trim().min(1, { error: "Name is required" }),
    email: z.email({ error: "Invalid email address" }),
    role: z.enum(["ADMIN", "PHARMACIST"], { error: "Select a role" })
});

export const createUserSchema = baseUserSchema.extend({
    password: z.string().min(8, { error: "Password must be at least 8 characters" })
});

export const updateUserSchema = baseUserSchema.extend({
    password: z.union([
        z.literal(""),
        z.string().min(8, { error: "Password must be at least 8 characters" })
    ])
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
