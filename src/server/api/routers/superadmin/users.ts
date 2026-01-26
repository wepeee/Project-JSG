import { z } from "zod";
import { hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, superAdminProcedure } from "../../trpc";
import { Role } from "~/../generated/prisma"; // samain path

export const adminUsersRouter = createTRPCRouter({
  createUser: superAdminProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(8),
        role: z.nativeEnum(Role),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.user.findUnique({
        where: { username: input.username },
        select: { id: true },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username sudah dipakai",
        });
      }

      const passwordHash = await hash(input.password, 12);

      return ctx.db.user.create({
        data: {
          username: input.username,
          passwordHash,
          role: input.role as Role,
        },
        select: { id: true, username: true, role: true, createdAt: true },
      });
    }),

  getUsers: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }),
});
