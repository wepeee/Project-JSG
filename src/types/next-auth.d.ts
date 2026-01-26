import "next-auth";
import "next-auth/jwt";

// IMPORTANT:
// Import Role dari tempat yang SAMA dengan PrismaClient kamu.
// Kalau db.ts kamu import dari "@prisma/client", pakai ini:
import type { Role } from "@prisma/client";
// Kalau db.ts kamu import PrismaClient dari "../generated/prisma", ganti ke:
// import type { Role } from "../../generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}
