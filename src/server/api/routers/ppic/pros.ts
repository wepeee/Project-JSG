import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const ppicProcedure = protectedProcedure;

const pad3 = (n: number) => String(n).padStart(3, "0"); // 001..999
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);

export const prosRouter = createTRPCRouter({
  list: ppicProcedure.query(({ ctx }) => {
    return ctx.db.pro.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        steps: {
          orderBy: { orderNo: "asc" },
          include: {
            process: true,
            machine: true,
            materials: { include: { material: true } },
          },
        },
      },
    });
  }),

  create: ppicProcedure
    .input(
      z.object({
        productName: z.string().min(1),
        qtyPoPcs: z.number().int().positive(),
        up: z.number().int().positive().optional(),
        startDate: z.coerce.date().optional(), // kalau kosong pakai today
        steps: z
          .array(
            z.object({
              processId: z.number().int().positive(),
              machineId: z.number().int().positive().nullable().optional(),
              materials: z
                .array(
                  z.object({
                    materialId: z.number().int().positive(),
                    qtyReq: z.number().positive(),
                  }),
                )
                .default([]),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const baseDate = input.startDate ?? new Date();

      // proses pertama = step[0]
      const first = input.steps[0];
      const proc = await ctx.db.process.findUnique({
        where: { id: first.processId },
        select: { code: true },
      });
      if (!proc)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Proses pertama tidak valid",
        });

      const prefix = `${proc.code}${mm(baseDate)}${yy(baseDate)}`; // 6 digit

      return ctx.db.$transaction(async (tx) => {
        const seq = await tx.proSequence.upsert({
          where: { prefix },
          update: { last: { increment: 1 } },
          create: { prefix, last: 1 },
          select: { last: true },
        });

        const proNumber = `${prefix}${pad3(seq.last)}`; // 9 digit

        const created = await tx.pro.create({
          data: {
            proNumber,
            productName: input.productName,
            qtyPoPcs: input.qtyPoPcs,
            up: input.up,
            startDate: input.startDate,
            status: "OPEN",
            steps: {
              create: input.steps.map((s, idx) => ({
                orderNo: idx + 1,
                processId: s.processId,
                machineId: s.machineId ?? null,
                materials: {
                  create: (s.materials ?? []).map((m) => ({
                    materialId: m.materialId,
                    qtyReq: new Prisma.Decimal(m.qtyReq),
                  })),
                },
              })),
            },
          },
        });

        return created;
      });
    }),
});
