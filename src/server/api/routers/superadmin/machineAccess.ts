import { z } from "zod";
import {
  createTRPCRouter,
  superAdminProcedure,
  protectedProcedure,
} from "../../trpc";

export const machineAccessRouter = createTRPCRouter({
  /**
   * Daftar semua user beserta mesin yang dimiliki
   * (untuk halaman admin)
   */
  listByUser: superAdminProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.userId ? { userId: input.userId } : {};
      return ctx.db.userMachineAccess.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, role: true, department: true } },
          machine: { select: { id: true, name: true, type: true } },
        },
        orderBy: [{ userId: "asc" }, { machineId: "asc" }],
      });
    }),

  /**
   * Daftar mesin yang dapat diakses oleh user yang sedang login
   * (dipakai di schedule operator untuk filter)
   */
  myMachines: protectedProcedure.query(async ({ ctx }) => {
    const accesses = await ctx.db.userMachineAccess.findMany({
      where: { userId: ctx.session.user.id },
      select: { machineId: true, machine: { select: { id: true, name: true, type: true } } },
    });
    return accesses.map((a) => a.machine);
  }),

  /**
   * Set mesin yang dimiliki satu user (replace all)
   */
  setUserMachines: superAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        machineIds: z.array(z.number().int()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Delete yang lama, insert yang baru (replace approach)
      await ctx.db.$transaction([
        ctx.db.userMachineAccess.deleteMany({ where: { userId: input.userId } }),
        ...(input.machineIds.length > 0
          ? [
              ctx.db.userMachineAccess.createMany({
                data: input.machineIds.map((machineId) => ({
                  userId: input.userId,
                  machineId,
                })),
                skipDuplicates: true,
              }),
            ]
          : []),
      ]);
      return { ok: true, count: input.machineIds.length };
    }),

  /**
   * Tambah 1 akses mesin ke user
   */
  grant: superAdminProcedure
    .input(z.object({ userId: z.string(), machineId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userMachineAccess.upsert({
        where: { userId_machineId: { userId: input.userId, machineId: input.machineId } },
        create: { userId: input.userId, machineId: input.machineId },
        update: {}, // no-op jika sudah ada
      });
    }),

  /**
   * Cabut 1 akses mesin dari user
   */
  revoke: superAdminProcedure
    .input(z.object({ userId: z.string(), machineId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userMachineAccess.deleteMany({
        where: { userId: input.userId, machineId: input.machineId },
      });
      return { ok: true };
    }),
});
