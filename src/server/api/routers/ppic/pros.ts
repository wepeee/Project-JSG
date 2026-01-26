import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const ppicProcedure = protectedProcedure;

const pad3 = (n: number) => String(n).padStart(3, "0"); // 001..999
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);

export const prosRouter = createTRPCRouter({
  list: ppicProcedure
    .input(
      z.object({
        q: z.string().optional(), // search proNumber / productName
        status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        take: z.number().min(5).max(50).default(20),
        cursor: z.number().int().positive().optional(), // pakai Pro.id
      }),
    )
    .query(async ({ ctx, input }) => {
      const take = input.take ?? 20;
      const q = input.q?.trim();

      const where: any = {};
      if (input.status) where.status = input.status;

      if (q) {
        where.OR = [
          { proNumber: { contains: q } },
          { productName: { contains: q } },
        ];
      }

      const items = await ctx.db.pro.findMany({
        take: take + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        where,
        orderBy: { id: "desc" },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          createdAt: true,
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              process: { select: { code: true, name: true } },
              machine: { select: { name: true } },
              materials: {
                select: {
                  qtyReq: true,
                  material: { select: { name: true, uom: true } },
                },
              },
            },
          },
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > take) {
        const next = items.pop()!;
        nextCursor = next.id;
      }

      return { items, nextCursor };
    }),

  create: ppicProcedure
    .input(
      z.object({
        productName: z.string().min(1),
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        steps: z
          .array(
            z.object({
              processId: z.number().int().positive(),
              up: z.number().int().positive().optional(), // ✅ pindah ke step
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

      const steps = input.steps;

      if (!steps.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Steps minimal 1",
        });
      }

      const first = steps[0]!;
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
            startDate: input.startDate,
            status: "OPEN",
            steps: {
              create: input.steps.map((s, idx) => ({
                orderNo: idx + 1,
                processId: s.processId,
                up: s.up,
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

  getById: ppicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.pro.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          proNumber: true,
          productName: true,
          qtyPoPcs: true,
          startDate: true,
          status: true,
          createdAt: true,
          steps: {
            orderBy: { orderNo: "asc" },
            select: {
              id: true,
              orderNo: true,
              up: true,
              processId: true,
              process: { select: { code: true, name: true } },
              machineId: true,
              machine: { select: { name: true } },
              materials: {
                select: {
                  id: true,
                  qtyReq: true,
                  materialId: true,
                  material: { select: { name: true, uom: true } },
                },
              },
            },
          },
        },
      });
    }),
  update: ppicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        productName: z.string().min(1),
        qtyPoPcs: z.number().int().positive(),
        startDate: z.coerce.date().optional(),
        status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        steps: z
          .array(
            z.object({
              orderNo: z.number().int().positive(),
              processId: z.number().int().positive(),
              up: z.number().int().positive(),
              machineId: z.number().int().positive().nullable().optional(),
              materialId: z.number().int().positive().nullable().optional(),
              qtyReq: z.number().positive().optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        // update header
        await tx.pro.update({
          where: { id: input.id },
          data: {
            productName: input.productName,
            qtyPoPcs: input.qtyPoPcs,
            startDate: input.startDate,
            ...(input.status ? { status: input.status } : {}),
          },
        });

        // hapus semua steps lama (cascade akan hapus proStepMaterial kalau relasinya onDelete Cascade)
        await tx.proStep.deleteMany({ where: { proId: input.id } });

        // create ulang
        await tx.proStep.createMany({
          data: input.steps.map((s) => ({
            proId: input.id,
            orderNo: s.orderNo,
            processId: s.processId,
            up: s.up,
            machineId: s.machineId ?? null,
          })),
        });

        // Ambil step baru untuk mapping material (butuh id)
        const newSteps = await tx.proStep.findMany({
          where: { proId: input.id },
          select: { id: true, orderNo: true },
        });

        const stepIdByOrder = new Map(newSteps.map((s) => [s.orderNo, s.id]));

        const mats = input.steps
          .filter((s) => s.materialId)
          .map((s) => {
            const stepId = stepIdByOrder.get(s.orderNo);
            if (!stepId)
              throw new Error(`StepId not found for orderNo=${s.orderNo}`);

            return {
              stepId,
              materialId: s.materialId!,
              qtyReq: s.qtyReq ?? 0,
            };
          });

        if (mats.length) {
          await tx.proStepMaterial.createMany({ data: mats });
        }

        return tx.pro.findUnique({
          where: { id: input.id },
          select: { id: true, proNumber: true },
        });
      });
    }),
});
