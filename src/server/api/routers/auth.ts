import { z } from "zod";
import { hash } from "bcryptjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user; // sudah ada id + role dari Auth.js callbacks
  }),

  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const passwordHash = await hash(input.password, 12);
      const user = await ctx.db.user.create({
        data: {
          username: input.username,
          passwordHash,
        },
        select: { id: true, username: true, role: true },
      });
      return user;
    }),
});
