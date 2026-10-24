import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";
import { Role } from "@/generated/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            authorize: async(credentials) =>  {
                const parsed = loginSchema.safeParse(credentials);
                if(!parsed.success) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: parsed.data.email,
                    }
                });
                if(!user) {
                    return null;
                }
                const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
                if(!isValid) {
                    return null;
                }
                return { id: user.id, name: user.name, email: user.email, role: user.role }
            },
        })
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    callbacks: {
        jwt: ({ token, user }) => {
            if(user) {
                token.id = user.id as string;
                token.role = user.role
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user.id = token.id;
            session.user.role = token.role as Role;
            return session;
        }

    }
})
