import { z } from "zod";
import { createTRPCRouter, superAdminProcedure } from "../../trpc";

const inputSchema = z
  .object({
    limit: z.number().min(20).max(500).default(200),
    type: z
      .enum(["ALL", "USER", "REPORT", "ITEM", "MACHINE", "PRO"])
      .default("ALL"),
    search: z.string().trim().optional(),
  })
  .optional();

type AuditType = "USER" | "REPORT" | "ITEM" | "MACHINE" | "PRO";

type AuditEntry = {
  id: string;
  at: Date;
  type: AuditType;
  action: string;
  actor: string;
  target: string;
  detail?: string;
};

export const auditRouter = createTRPCRouter({
  list: superAdminProcedure.input(inputSchema).query(async ({ ctx, input }) => {
    const limit = input?.limit ?? 200;
    const fetchTake = Math.min(limit, 200);

    const [users, reports, items, machines, pros] = await Promise.all([
      ctx.db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: fetchTake,
        select: {
          id: true,
          username: true,
          role: true,
          department: true,
          createdAt: true,
        },
      }),
      ctx.db.productionReport.findMany({
        orderBy: { updatedAt: "desc" },
        take: fetchTake,
        select: {
          id: true,
          operatorName: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          checkedAt: true,
          checkedById: true,
          voidedAt: true,
          voidedById: true,
          voidReason: true,
          rejectionNote: true,
          proses: {
            select: {
              orderNo: true,
              machine: { select: { name: true } },
              pro: { select: { proNumber: true, productName: true } },
            },
          },
          checkedBy: { select: { username: true } },
        },
      }),
      ctx.db.item.findMany({
        orderBy: { updatedAt: "desc" },
        take: fetchTake,
        select: {
          id: true,
          code: true,
          name: true,
          kind: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          createdFrom: true,
          createdBy: { select: { username: true } },
        },
      }),
      ctx.db.machine.findMany({
        orderBy: { updatedAt: "desc" },
        take: fetchTake,
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      ctx.db.pro.findMany({
        orderBy: { updatedAt: "desc" },
        take: fetchTake,
        select: {
          id: true,
          proNumber: true,
          productName: true,
          type: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          createdBy: { select: { username: true } },
          updatedBy: { select: { username: true } },
        },
      }),
    ]);

    const entries: AuditEntry[] = [];

    for (const u of users) {
      entries.push({
        id: `user-created-${u.id}`,
        at: u.createdAt,
        type: "USER",
        action: "USER_CREATED",
        actor: "system",
        target: `${u.username} (${u.role}${u.department ? `/${u.department}` : ""})`,
      });
    }

    for (const r of reports) {
      const reportTarget = `Report ${r.id} - PRO ${r.proses.pro.proNumber} - Step ${r.proses.orderNo}`;
      const machineInfo = r.proses.machine?.name
        ? `Machine ${r.proses.machine.name}`
        : "Machine -";
      const productInfo = `Produk ${r.proses.pro.productName}`;

      entries.push({
        id: `report-created-${r.id}`,
        at: r.createdAt,
        type: "REPORT",
        action: "REPORT_CREATED",
        actor: r.operatorName || "operator",
        target: reportTarget,
        detail: `${machineInfo} - ${productInfo}`,
      });

      if (r.updatedAt.getTime() - r.createdAt.getTime() > 1000) {
        entries.push({
          id: `report-updated-${r.id}-${r.updatedAt.getTime()}`,
          at: r.updatedAt,
          type: "REPORT",
          action: "REPORT_UPDATED",
          actor: r.operatorName || "operator",
          target: reportTarget,
          detail: `${machineInfo} - ${productInfo}`,
        });
      }

      if (r.checkedAt) {
        entries.push({
          id: `report-checked-${r.id}-${r.checkedAt.getTime()}`,
          at: r.checkedAt,
          type: "REPORT",
          action:
            r.status === "APPROVED"
              ? "REPORT_APPROVED"
              : r.status === "REJECTED"
                ? "REPORT_REJECTED"
                : "REPORT_CHECKED",
          actor: r.checkedBy?.username ?? r.checkedById ?? "unknown",
          target: reportTarget,
          detail: r.rejectionNote ? `Catatan: ${r.rejectionNote}` : undefined,
        });
      }

      if (r.voidedAt) {
        entries.push({
          id: `report-voided-${r.id}-${r.voidedAt.getTime()}`,
          at: r.voidedAt,
          type: "REPORT",
          action: "REPORT_VOIDED",
          actor: r.voidedById ?? "unknown",
          target: reportTarget,
          detail: r.voidReason ? `Alasan: ${r.voidReason}` : undefined,
        });
      }
    }

    for (const item of items) {
      entries.push({
        id: `item-created-${item.id}`,
        at: item.createdAt,
        type: "ITEM",
        action: "ITEM_CREATED",
        actor: item.createdBy?.username ?? item.createdFrom ?? "system",
        target: `${item.code} - ${item.name}`,
        detail: `${item.kind} - ${item.status}`,
      });

      if (item.updatedAt.getTime() - item.createdAt.getTime() > 1000) {
        entries.push({
          id: `item-updated-${item.id}-${item.updatedAt.getTime()}`,
          at: item.updatedAt,
          type: "ITEM",
          action: "ITEM_UPDATED",
          actor: "system",
          target: `${item.code} - ${item.name}`,
          detail: `${item.kind} - ${item.status}`,
        });
      }
    }

    for (const m of machines) {
      entries.push({
        id: `machine-created-${m.id}`,
        at: m.createdAt,
        type: "MACHINE",
        action: "MACHINE_CREATED",
        actor: "system",
        target: `${m.name} (${m.type})`,
      });

      if (m.updatedAt.getTime() - m.createdAt.getTime() > 1000) {
        entries.push({
          id: `machine-updated-${m.id}-${m.updatedAt.getTime()}`,
          at: m.updatedAt,
          type: "MACHINE",
          action: "MACHINE_UPDATED",
          actor: "system",
          target: `${m.name} (${m.type})`,
        });
      }
    }

    for (const p of pros) {
      const target = `${p.proNumber} - ${p.productName}`;

      entries.push({
        id: `pro-created-${p.id}`,
        at: p.createdAt,
        type: "PRO",
        action: "PRO_CREATED",
        actor: p.createdBy?.username ?? "ppic",
        target,
        detail: `${p.type} - ${p.status}`,
      });

      if (p.updatedAt.getTime() - p.createdAt.getTime() > 1000) {
        entries.push({
          id: `pro-updated-${p.id}-${p.updatedAt.getTime()}`,
          at: p.updatedAt,
          type: "PRO",
          action: "PRO_UPDATED",
          actor: p.updatedBy?.username ?? p.createdBy?.username ?? "ppic",
          target,
          detail: `${p.type} - ${p.status}`,
        });
      }
    }

    let filtered = entries;
    if (input?.type && input.type !== "ALL") {
      filtered = filtered.filter((e) => e.type === input.type);
    }

    const needle = input?.search?.toLowerCase();
    if (needle) {
      filtered = filtered.filter((e) =>
        [e.action, e.actor, e.target, e.detail ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      );
    }

    return filtered
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, limit);
  }),
});
