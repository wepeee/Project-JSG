import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { compare } from "bcryptjs";

import { db } from "./db";
import { Role } from "../../generated/prisma"; // sesuaikan kalau path kamu beda

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  // bantu debug kalau ada error auth di dev
  debug: process.env.NODE_ENV === "development",

  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },

      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { username },
          select: {
            id: true,
            username: true,
            role: true,
            passwordHash: true,
          },
        });

        if (!user) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        // object ini masuk ke callbacks.jwt sebagai `user`
        return {
          id: user.id,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      // pertama kali login, `user` ada
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },

    session({ session, token }) {
      // session.user pasti ada di NextAuth
      session.user.id = token.id as string;
      session.user.role = (token.role as Role) ?? Role.ADMIN;
      return session;
    },
  },
});
