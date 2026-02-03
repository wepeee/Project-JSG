
import { PrismaClient } from "../generated/prisma";
import { MachineType, Uom } from "../generated/prisma";

const prisma = new PrismaClient();

const RIGID_DATA = [
  { partNumber: "72504008", productName: "PRINTING PUV - COVER ACRYLIC KKI", ct: 1.7, cavity: 1, mp: 2, uom: "PCS", workCenter: "PUV", phase: "1 PHASE", stdHr: 2100 },
  { partNumber: "72404182", productName: "PRINTING PUV - KEMASAN POT ACRYLIC WHITENING DAY CREAM TUTUP PLASTIK 10 GR NEW ARTWORK", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504009", productName: "PRINTING PUV - WHITENING NIGHT CREAM 13,8 GR - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72404181", productName: "PRINTING MSG - KEMASAN POT ACRYLIC WHITENING NIGHT CREAM TUTUP PLASTIK 13.8 NEW ART WORK PHS 1 & 2", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504010", productName: "PRINTING PUV - ACNE NIGHT CREAM 13,8 GR - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504014", productName: "PRINTING PUV - WHITENING DAY CREAM 10 GR - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504012", productName: "ULTIMATE NIGHT CREAM 13.8 GR - PRINTING PUV - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504011", productName: "PRINTING PUV LUMINOUS NIGHT CREAM 13.8 GR - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504078", productName: "PRINTNG PUV MSG - PRINTING KEMASAN LUMINOUS WHITENING", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504013", productName: "WHITENING CELL DNA NIGHT CREAM 13.8 GR - PRINTING PUV - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504350", productName: "PRINTING PUV - ACNEZONE NIGHT CREAM 13,8 GR - PRINTING PUV - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504349", productName: "PRINTING PUV - ULTIMATE CAVIAR NIGHT CREAM 13,8 GR - PRINTING PUV - WIP", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72429146", productName: "PRINTING MANUAL MSG - KEMASAN POT ACRYLIC SUNWHITE DAILY CREAM TUTUP PLASTIK 13.8 GR NEW ARTWORK PHS1", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72413146", productName: "PRINTING MANUAL MSG - KEMASAN POT ACRYLIC SUNWHITE DAILY CREAM TUTUP PLASTIK 13.8 GR NEW ARTWORK PHS2", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72504016", productName: "PRINTING PUV - PRINTING KEMASAN POT ACRYLIC SUNWHITE DAILY CREAM TUTUP PLASTIK 13.8 GR", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72413181", productName: "PRINTING MSG - KEMASAN POT ACRYLIC WHITENING NIGHT CREAM TUTUP PLASTIK 13,8 GR NEW ARTWORK PHS 1 (DEPAN)", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72429181", productName: "PRINTING MSG - KEMASAN POT ACRYLIC WHITENING NIGHT CREAM TUTUP PLASTIK 13,8 GR NEW ARTWORK PHS 2 (BELAKANG)", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72404178", productName: "PRINTING PUV WIP - KEMASAN POT ACRYLIC LUMINOUS WITENING NIGHT CREAM TUTUP PLASTIK 13.8 GR NEW ARTWORK", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72404046", productName: "PRINTING COVER ACRYLIC", ct: 1.7, cavity: 1, mp: 2, uom: "PCS", workCenter: "PUV", phase: "1 PHASE", stdHr: 2100 },
  { partNumber: "72504007", productName: "PRINTING PUV - COVER ACRYLIC 6 VARIAN NIGHT - PRINTING PUV - WIP", ct: 1.7, cavity: 1, mp: 2, uom: "PCS", workCenter: "PUV", phase: "1 PHASE", stdHr: 2100 },
  
  // Some extra items from list
  { partNumber: "72513085 (1)", productName: "PRINTING MANUAL - PRINTING KEMASAN BEBIOTIC KYUT HYDRATING LIP BALM (BL) - BLUE", ct: 25.2, cavity: 1, mp: 1, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 142 },
  { partNumber: "72513083", productName: "PRINTING MANUAL - MELIA SKINCARE YOUTH INFINITE SUNSCREEN MIST", ct: 16.8, cavity: 1, mp: 1, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 214 },
  { partNumber: "72604353", productName: "COVER ACRYLIC KKI - PRINTING PUV - WIP - NEW DESIGN", ct: 1.7, cavity: 1, mp: 2, uom: "PCS", workCenter: "PUV", phase: "1 PHASE", stdHr: 2100 },
  { partNumber: "72513085 (2)", productName: "PRINTING MANUAL - PRINTING KEMASAN BEBIOTIC KYUT HYDRATING LIP BALM (CAP) - BLUE", ct: 25.2, cavity: 1, mp: 1, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 143 },
  { partNumber: "72513085 (3)", productName: "PRINTING MANUAL - PRINTING KEMASAN BEBIOTIC KYUT HYDRATING LIP BALM (BL) - WHITE", ct: 25.2, cavity: 1, mp: 1, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 143 },
  { partNumber: "72513085 (4)", productName: "PRINTING MANUAL - PRINTING KEMASAN BEBIOTIC KYUT HYDRATING LIP BALM (CAP) - WHITE", ct: 25.2, cavity: 1, mp: 1, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 143 },
  { partNumber: "72513085", productName: "PRINTING MANUAL - PRINTING BOTOL ENERGY SERUM 20 ML", ct: 19.38, cavity: 1, mp: 1, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 186 },
  { partNumber: "7250409", productName: "PRINTING PUV - PRINTING KEMASAN POT ACRYLIC SUNWHITE DAILY CREAM TUTUP PLASTIK 13,8 GR - BISINDO", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72513114 (1)", productName: "PRINTING MANUAL - PRINTING KEMASAN MSG GLOZE LIP STAIN PHASE 1 (HITAM)", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
  { partNumber: "72513114 (2)", productName: "PRINTING MANUAL - PRINTING KEMASAN MSG GLOZE LIP STAIN PHASE 2 (BIRU)", ct: 3, cavity: 1, mp: 3, uom: "PCS", workCenter: "SK MANUAL", phase: "1 PHASE", stdHr: 1200 },
];

async function main() {
  console.log("Seeding rigid machines...");

  for (const item of RIGID_DATA) {
     const shift = Math.round(item.stdHr * 7);
     const day = shift * 3;

     // Use upsert to avoid duplicate if re-run
     const exists = await prisma.machine.findFirst({
         where: {
             type: "RIGID",
             name: item.productName,
             partNumber: item.partNumber
         }
     });

     if (!exists) {
        await prisma.machine.create({
            data: {
                name: item.productName, // Using Product Name as Machine Name for this dirty schema
                type: "RIGID",
                uom: "pcs",
                stdOutputPerHour: item.stdHr,
                stdOutputPerShift: shift,
                stdOutputPerDay: day,
                partNumber: item.partNumber,
                cycleTimeSec: item.ct,
                cycleTimeMin: item.ct / 60,
                cavity: item.cavity,
                manPower: item.mp,
                workCenter: item.workCenter,
                phase: item.phase,
            }
        });
        console.log(`Created: ${item.productName}`);
     } else {
        console.log(`Skipped (Exists): ${item.productName}`);
     }
  }

  console.log("Done.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
