import { PrismaClient } from "../generated/prisma";
import { MachineType, Uom } from "../generated/prisma";

type ConfigItem =
  | { prefix: string; range: [number, number]; name?: never }
  | { name: string; prefix?: never; range?: never };

const RIGID_MACHINES_CONFIG: ConfigItem[] = [
  { prefix: "IMM", range: [1, 15] },
  { prefix: "PUV", range: [1, 4] },
  { name: "CA102" },
  { prefix: "PAD PRINT", range: [1, 2] },
  { prefix: "SK PRINT", range: [1, 4] },
  { prefix: "LINE", range: [1, 2] },
  { prefix: "ASSEMBLY", range: [1, 3] },
  { prefix: "PACKING", range: [1, 4] },
  { prefix: "EBM", range: [1, 3] },
];

export async function seedRigid(prisma: PrismaClient) {
  console.log("Seeding Rigid Machines & Cleaning Old Ones...");

  // 1. Generate list of valid names
  const validNames: string[] = [];

  for (const config of RIGID_MACHINES_CONFIG) {
    if (config.range) {
      const [start, end] = config.range;
      for (let i = start; i <= end; i++) {
        validNames.push(`${config.prefix} ${i}`);
      }
    } else if (config.name) {
      validNames.push(config.name);
    }
  }

  // 2. Delete RIGID machines that are NOT in the valid list
  console.log("Cleaning up old RIGID machines...");

  const deleteResult = await prisma.machine.deleteMany({
    where: {
      type: "RIGID",
      name: {
        notIn: validNames,
      },
    },
  });

  console.log(`Deleted ${deleteResult.count} old/invalid RIGID machines.`);

  // 3. Upsert valid machines (ensure they exist)
  for (const name of validNames) {
    const existing = await prisma.machine.findFirst({
      where: { name, type: "RIGID" },
    });

    if (!existing) {
      await prisma.machine.create({
        data: {
          name,
          type: "RIGID",
          uom: "pcs" as Uom,
          stdOutputPerHour: 0,
          stdOutputPerShift: 0,
          stdOutputPerDay: 0,
          cycleTimeSec: 0,
          cycleTimeMin: 0,
          cavity: 0,
          manPower: 0,
        },
      });
    }
  }

  console.log("Done syncing rigid machines.");
}
