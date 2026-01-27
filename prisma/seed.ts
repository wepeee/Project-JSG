import { PrismaClient } from "../generated/prisma"; // penting: sesuai schema output
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const username = "superadmin";
  const plainPassword = "superadmin";
  const passwordHash = await hash(plainPassword, 12);

  await db.user.upsert({
    where: { username },
    update: {
      passwordHash,
      role: "SUPERADMIN",
    },
    create: {
      username,
      passwordHash,
      role: "SUPERADMIN",
    },
  });

  // Create PPIC User
  const ppicUser = "ppic";
  const ppicPass = "ppic";
  const ppicHash = await hash(ppicPass, 12);

  await db.user.upsert({
    where: { username: ppicUser },
    update: {
      passwordHash: ppicHash,
      role: "PPIC",
    },
    create: {
      username: ppicUser,
      passwordHash: ppicHash,
      role: "PPIC",
    },
  });

  // Machines Seed Data
  const machines = [
    {
      name: "GOWEI PAPER CUTTER MACHINE",
      stdOutputPerHour: 2500,
      stdOutputPerShift: 17000,
      uom: "sheet",
      remark: "sisir dan bagi 2",
    },
    {
      name: "GOWEI PAPER CUTTER MACHINE FINISHING",
      stdOutputPerHour: 2500,
      stdOutputPerShift: 17000,
      uom: "sheet",
      remark: "sisir dan bagi 2",
    },
    {
      name: "SPEEDMASTER SX-74 FRONT",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "sheet",
      remark: null,
    },
    {
      name: "SPEEDMASTER SX-74 BACK",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "sheet",
      remark: null,
    },
    {
      name: "SPEEDMASTER SX-74 OPV FRONT",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "sheet",
      remark: null,
    },
    {
      name: "SPEEDMASTER SX-74 OPV BACK",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "sheet",
      remark: null,
    },
    {
      name: "SF 720 FRONT",
      stdOutputPerHour: 429,
      stdOutputPerShift: 2914,
      uom: "sheet",
      remark: null,
    },
    {
      name: "SF 720 BACK",
      stdOutputPerHour: 429,
      stdOutputPerShift: 2914,
      uom: "sheet",
      remark: null,
    },
    {
      name: "INNOVATIVE DTS 1600 - LAMINASI DINGIN",
      stdOutputPerHour: 457,
      stdOutputPerShift: 3109,
      uom: "sheet",
      remark: null,
    },
    {
      name: "JINBAO UV SPOT 1",
      stdOutputPerHour: 193,
      stdOutputPerShift: 1311,
      uom: "sheet",
      remark: null,
    },
    {
      name: "JINBAO UV SPOT 2",
      stdOutputPerHour: 193,
      stdOutputPerShift: 1311,
      uom: "sheet",
      remark: null,
    },
    {
      name: "TMYK 750 DIE CUT",
      stdOutputPerHour: 200,
      stdOutputPerShift: 1360,
      uom: "sheet",
      remark: null,
    },
    {
      name: "TMYK 750 HOTSTAMPING",
      stdOutputPerHour: 200,
      stdOutputPerShift: 1360,
      uom: "sheet",
      remark: null,
    },
    {
      name: "TMYK 750 EMBOSS",
      stdOutputPerHour: 200,
      stdOutputPerShift: 1360,
      uom: "sheet",
      remark: null,
    },
    {
      name: "MK-EASY MATRIX",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "sheet",
      remark: null,
    },
    {
      name: "MK-EASY MATRIX-EMBS",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "sheet",
      remark: null,
    },
    {
      name: "MANUAL BUBUT",
      stdOutputPerHour: 2000,
      stdOutputPerShift: 13600,
      uom: "sheet",
      remark: null,
    },
    {
      name: "MANUAL SORTIR PACKING",
      stdOutputPerHour: 900,
      stdOutputPerShift: 6120,
      uom: "pcs",
      remark: null,
    },
    {
      name: "MK-DIANA GO",
      stdOutputPerHour: 3600,
      stdOutputPerShift: 24480,
      uom: "meter",
      remark: "tergantung panjang produk dan gap per produk",
    },
    {
      name: "MANUAL GLUEING ASSEMBLING",
      stdOutputPerHour: 143,
      stdOutputPerShift: 971,
      uom: "pcs",
      remark: "produk holder hardbox gold serum (proses paling lama)",
    },
    {
      name: "SUPRASETTER",
      stdOutputPerHour: 4,
      stdOutputPerShift: 27,
      uom: "sheet",
      remark: null,
    },
    {
      name: "GRAPHTEC CE-6000 120",
      stdOutputPerHour: 40,
      stdOutputPerShift: 272,
      uom: "sheet",
      remark: "kisscut",
    },
    {
      name: "VERSAFIRE",
      stdOutputPerHour: 200,
      stdOutputPerShift: 1360,
      uom: "sheet",
      remark: "ivory",
    },
    {
      name: "JWEI",
      stdOutputPerHour: 6000,
      stdOutputPerShift: 40800,
      uom: "cm",
      remark: "diecut",
    },
    {
      name: "MANUAL SORTIR ASSEMBLING",
      stdOutputPerHour: 114,
      stdOutputPerShift: 777,
      uom: "pcs",
      remark: "produk sunscreen spray (bottom lock)",
    },
  ];

  for (const m of machines) {
    await db.machine.upsert({
      where: { id: machines.indexOf(m) + 1 }, // Menggunakan ID manual untuk seed ini atau ganti logic jika id auto
      update: {
        name: m.name,
        stdOutputPerHour: m.stdOutputPerHour,
        stdOutputPerShift: m.stdOutputPerShift,
        uom: m.uom as any,
        remark: m.remark,
      },
      create: {
        name: m.name,
        stdOutputPerHour: m.stdOutputPerHour,
        stdOutputPerShift: m.stdOutputPerShift,
        uom: m.uom as any,
        remark: m.remark,
      },
    });
  }

  // Machines Seed Data (existing code...)
  // ... loop machines ...

  // Materials Seed Data
  const materials = [
    { name: "PETRO DRIER", uom: "kg" },
    { name: "TINTA ASP PROCESS BLACK", uom: "kg" },
    { name: "TINTA OFFSET - TC 7000 WHITE", uom: "kg" },
    { name: "TINTA TC 0001 MEDIUM", uom: "kg" },
    { name: "TINTA TC 1705 DEEP RED", uom: "kg" },
    { name: "TINTA IB MS GLOW FLAP LIGHT GREEN KOSMETIKA", uom: "kg" },
    {
      name: "TINTA OFFSET - IB MS GLOW DSR TULISAN TREATMENT LIGHT GREEN",
      uom: "kg",
    },
    { name: "TINTA TC 1705 DEEP RED ", uom: "kg" },
    { name: "TINTA OFFSET - IB TC 4202 C LIGHT GREEN", uom: "kg" },
    { name: "TINTA CEMATO - IB BEEGANIC PINK", uom: "kg" },
    { name: "TINTA CEMATO - IB HEMPIRE BLUE", uom: "kg" },
    { name: "TINTA OFFSET - IB SAFFRESKIN PINK", uom: "kg" },
    { name: "TINTA CEMATO - IB RANS BEAUTY YELLOW", uom: "kg" },
    { name: "TINTA CEMATO - IB RANS BEAUTY DARK BROWN", uom: "kg" },
    { name: "TINTA CEMATO - IB RANS BEAUTY LIGHT CREAM 3", uom: "kg" },
    { name: "TINTA CEMATO - IB RANS BEAUTY LIGHT YELLOW 2", uom: "kg" },
    { name: "TINTA CEMATO - IB RANS BEAUTY LIGHT GREEN NO 3", uom: "kg" },
    { name: "TINTA CEMATO - IB RANS BEAUTY LIGHT BLUE 2", uom: "kg" },
    { name: "TINTA IB P 510 C PINK NO. 2", uom: "kg" },
    { name: "TINTA OFFSET - IB RANS BEAUTY P 7502 C CREAM", uom: "kg" },
    { name: "TINTA TC 5500 BLACK", uom: "kg" },
    { name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - YELLOW", uom: "kg" },
    { name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - CYAN", uom: "kg" },
    { name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - BLACK", uom: "kg" },
    { name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - MAGENTA", uom: "kg" },
    { name: "TINTA OFFSET - IB P 7502 C LIGHT BROWN", uom: "kg" },
    { name: "TINTA IB MOIN BLUE", uom: "kg" },
    { name: "TINTA IB MOIN ORANGE", uom: "kg" },
    { name: "TINTA IB SKINTHEORY GREEN", uom: "kg" },
    { name: "TINTA ASP KOSME BLACK", uom: "kg" },
    { name: "ASP MS GLOW YELLOW NO. 2", uom: "kg" },
    { name: "KERTAS ART CARTON 360GSM UK. 109 X 79 PD G.O LUXE", uom: "sheet" },
    { name: "LEM PF 6259", uom: "kg" },
    { name: "STIKER BONTAC CAMEL UK. 54 * 70", uom: "sheet" },
    { name: "IVORY VA RDD 300 GSM 79 X 109 CM", uom: "sheet" },
    { name: "TINTA PRINT MANUAL - 37-S/ 75 BLACK", uom: "kg" },
    { name: "SPOT UV AROCOAT 6165", uom: "kg" },
    { name: "TINTA DIGITAL PRINTING - VERSAFIRE CV/EV TONER WHITE", uom: "kg" },
    { name: "TINTA ECO INK - PC1080 #2 CYAN", uom: "kg" },
    { name: "TINTA ECO INK - PC1080 #2 MAGENTA", uom: "kg" },
    { name: "TINTA ECO INK - PC1080 #2 YELLOW", uom: "kg" },
    { name: "UV SPOT", uom: "kg" },
    { name: "SAPHIRA FOUNT 511", uom: "kg" },
    { name: "SAPHIRA IPA TECH 25 LITER", uom: "kg" },
    { name: "STIKER VINYL TRANSPARANT", uom: "sheet" },
    { name: "STIKER VINYL GLOSSY WHITE", uom: "sheet" },
    { name: "STIKER VINYL METALIZE", uom: "sheet" },
    { name: "KERTAS ART CARTOON 360GSM UK. 109 X 79 G. DELUXE", uom: "sheet" },
    { name: "KERTAS IVORY 350GSM UK. 790 X 1090", uom: "sheet" },
    { name: "KERTAS ART PAPER 150GSM NEVIA UK. 79X109", uom: "sheet" },
    { name: "KERTAS ART PAPER 310GSM UK. 109 X 79", uom: "sheet" },
    { name: "KERTAS CELLO BOARD SILVER 325GSM UK.109X79", uom: "sheet" },
    { name: "KERTAS CELLO BOARD SILVER 325GSM UK.73 X 53", uom: "sheet" },
    { name: "KERTAS LINTEC PAPER A3+ ( UK. 325X485 )", uom: "sheet" },
    { name: "KERTAS BRITE PAPER A3+ 120GSM (UK. 32.5 X 48.5 )", uom: "sheet" },
    { name: "OPP THERMAL DOFF 18 MIC UK. 52X3000 (28.08 KG)", uom: "roll" },
    {
      name: "OPP THERMAL GLOSSY 18 MIC - UK. 52 X 3000 (28,08 KG)",
      uom: "roll",
    },
    {
      name: "OPP THERMAL GLOSSY 18 MIC - UK. 32 X 2000 (11,52 KG)",
      uom: "roll",
    },
    { name: "OPP THERMAL GLOSSY 18 MIC UK. 580X3000 (28.81 KG)", uom: "roll" },
    { name: "OPP THERMAL DOFF 18 MIC - UK. 32 X 3000 (17,28 KG)", uom: "roll" },
    {
      name: "OPP THERMAL GLOSSY 18 MIC - UK. 32 X 3000 (17,28 KG)",
      uom: "roll",
    },
    { name: "FOIL EMAS FOR HOTPRINT", uom: "roll" },
    { name: "KERTAS IVORY 250GSM UK. 790 X 1090", uom: "sheet" },
    { name: "WASH UP CLOTH", uom: "pcs" },
    { name: "SAPHIRA INK JAZZ 100 CYAN", uom: "kg" },
    { name: "SAPHIRA INK JAZZ 100 BLACK", uom: "kg" },
    { name: "SAPHIRA INK JAZZ 100 YELLOW", uom: "kg" },
    { name: "ROLLIN TBC1 3 PLY 772X627X1 96", uom: "pcs" },
    { name: "TINTA OFFSET - IB MAVIOR CREAM", uom: "kg" },
    { name: "TINTA OFFSET - RED FABLY", uom: "kg" },
    { name: "TINTA OFFSET - DARK BLUE FABLY", uom: "kg" },
    { name: "TINTA OFFSET - PINK DEWYGLOW SERUM", uom: "kg" },
    { name: "TINTA OFFSET - GREEN DEW MOISTURIZER", uom: "kg" },
    { name: "TINTA OFFSET - LIGHT BLUE DEW BRIGHTENING ESSENCE", uom: "kg" },
    { name: "FOIL HOTPRINT SILVER 64 X 120", uom: "roll" },
    { name: "FOIL HOTPRINT GOLD UK. 64 X 120", uom: "roll" },
    { name: "TINTA IB GREEN ACNE SPOT", uom: "kg" },
    { name: "TINTA IB ORANGE DARK SPOT", uom: "kg" },
    { name: "KERTAS IVORY 250 GR IMPORT CM 79 X 109", uom: "sheet" },
    { name: "LARGE FORMAT VINYL TRANSPARANT 1260MM X 50MM", uom: "roll" },
    { name: "LARGE FORMAT VINYL TRANSPARANT UK. 1550 X 50 MM", uom: "roll" },
    { name: "LAMINATING MATTE/DOFF 100 GRAM - PROLAM V70", uom: "roll" },
    { name: "LAMINATING GLOSS 100 GRAM - PROLAM V70", uom: "roll" },
    { name: "T. COS WHITE BACK 230 GR 65 X 100 IK VP S-CARD", uom: "sheet" },
    { name: "FOOPAK SL MATT 1/S PE GCI GR 79 X 109 IK", uom: "sheet" },
    { name: "TINTA OFFSET - IB DEOKSI TONER ORANGE", uom: "kg" },
    { name: "TINTA OFFSET - VS DEOKSI TONER ORANGE", uom: "kg" },
    { name: "KERTAS ART PAPER 85 79 X 109", uom: "sheet" },
    { name: "KERTAS ART PAPER 120 79 X 109", uom: "sheet" },
    { name: "TINTA VS MMM NOBU RATTAN STOOL BRONZE BLUE", uom: "kg" },
    { name: "TINTA MMM GREEN PLASTIC SCRAPPER (KAPE)", uom: "kg" },
    { name: "TINTA MMM GREEN PAINT TRAY", uom: "kg" },
    { name: "TINTA MMM PURPLE PAINT TRAY", uom: "kg" },
    { name: "OPV CTW GLOSSY", uom: "kg" },
    { name: "MIKA PVC UK. 50M x 140M", uom: "roll" },
    { name: "TINTA PURPLE HOMEDECO MMM", uom: "kg" },
    { name: "TINTA YELLOW HOMEDECO MMM", uom: "kg" },
    { name: "SAPHIRA UN SPEED 450 YELLOW 2.5 KG", uom: "kg" },
    { name: "SAPHIRA UN SPEED 450 BLACK 2.5 KG", uom: "kg" },
    { name: "TINTA OFFSET - IB MS GLOW SALMON DNA LIGHT PINK", uom: "kg" },
    { name: "KARTON KUNING NO. 30 1200GSM UK. 77X 65", uom: "sheet" },
    { name: "STICKER BONTAC UK. 65 X 100", uom: "sheet" },
    { name: "MIKA PVC UK. 18,5 X 16,5", uom: "pcs" },
    { name: "MIKA PVC RIGID UK. 0,15", uom: "pcs" },
    { name: "DUPLEX BACK GREY 250 GSM UK. 65 X 100", uom: "sheet" },
    { name: "FOIL HOTPRINT SILVER MU8 AL UK. 610MM X 122M", uom: "roll" },
    { name: "DUPLEX BACK GREY 250 GSM UK. 79 x 109", uom: "sheet" },
    { name: "DUPLEX BACK GREY 350 GSM UK. 79 X 109", uom: "sheet" },
    { name: "SAPHIRA UN SPEED 450 CYAN 2.5 KG", uom: "kg" },
    { name: "OPV CTW DOFF", uom: "kg" },
    { name: "TINTA TRIPPSY HOTTIE CARMINE YELLOW", uom: "kg" },
    { name: "TINTA TRIPPSY CHERISH CRUSH MAGENTA", uom: "kg" },
    { name: "TINTA TRIPPSY AMY RUBY RED", uom: "kg" },
    { name: "TINTA TRIPPSY SEXXY MARROON RED", uom: "kg" },
    { name: "TINTA TRIPPSY PINKY MOIST BLUE", uom: "kg" },
    { name: "TINTA TRIPPSY SHINE MACCAROON GREEN", uom: "kg" },
    { name: "TINTA TRIPPSY FLIRTY NUDE VIOLET", uom: "kg" },
    { name: "TINTA OFFSET - IB PORE AWAY BLUE", uom: "kg" },
    { name: "FOIL HOTPRINT UNGU UK. 64 X 120", uom: "roll" },
    { name: "FOIL HOTPRINT MERAH UK. 64 X 120", uom: "roll" },
    { name: "TINTA ART PAPER BAG SUGAR BOMB RED", uom: "kg" },
    { name: "TINTA AF ST VOLT REFLEX BLUE", uom: "kg" },
    { name: "TINTA AF P. COOL GREY 10 C", uom: "kg" },
    { name: "STICKER VINYL PET METALIZE", uom: "sheet" },
    { name: "SPONS EVA TEBAL 5 MM UK. 100 X 200 CM", uom: "pcs" },
    { name: "TINTA IB CALM METALIC GREEN", uom: "kg" },
    { name: "TINTA IB HYDRA METALIC BLUE", uom: "kg" },
    { name: "TINTA IB MAXI METALIC ORANGE", uom: "kg" },
    { name: "TINTA ASP MAGENTA DUAL CREAM", uom: "kg" },
    { name: "TINTA ASP YELLOW DUAL CREAM", uom: "kg" },
    { name: "CENTRALON RHU 70 25X5X3600 MM BS", uom: "pcs" },
    { name: "GRAFTAC SEALING FOIL 50 MM X 100 M", uom: "roll" },
    { name: "YY-53 RETARDER ( SLOW )", uom: "kg" },
    { name: "SAPHIRA PN REPLERNISHER 20L", uom: "pcs" },
    { name: "SAPHIRA PN DEVELOPHER 20L", uom: "pcs" },
    { name: "SAPHIRA WATER CONDITIONER", uom: "kg" },
    { name: "SAPHIRA WASH 561", uom: "kg" },
    { name: "SAPHIRA WASH 562", uom: "kg" },
    { name: "SAPHIRA WATER FIX", uom: "kg" },
    { name: "SAPHIRA CTP PREMIUM PLATE FINISHER", uom: "pcs" },
    { name: "SAPHIRA PA 27 745 X 605", uom: "pcs" },
    { name: "SAPHIRA PLATE CTPPQ2 27X745X605 PKT 60", uom: "pcs" },
    { name: "KERTAS SAMSON", uom: "sheet" },
    { name: "SAPHIRA SPRAY POWDER ST 35", uom: "kg" },
    { name: "SAPHIRA SPRAY CP MEDIUM", uom: "kg" },
    { name: "SAPHIRA BLANKET CONDITIONER", uom: "kg" },
    { name: "SAPHIRA ROLLER PASTE 700ML", uom: "pcs" },
    {
      name: "CENTRALON ORTECH 300 50X9X3810MM 75 SH POBC265 GREEN",
      uom: "pcs",
    },
    { name: "SAPHIRA DUMP CLEAN COMBI", uom: "kg" },
    { name: "SAPHIRA CHROME CONDITIONER", uom: "kg" },
    { name: "SAPHIRA PLATE CLEANER", uom: "kg" },
    { name: "SAPHIRA BLANKET CLEANER", uom: "kg" },
    { name: "PLAT LEMPENG BESI MAGNET 12MM", uom: "pcs" },
    { name: "THINNER PPC-070", uom: "kg" },
    { name: "SCREEN CLEANER", uom: "kg" },
    { name: "ISOLASI OPP DAIMARU UK.48 MM", uom: "pcs" },
    { name: "PLAT LEMPENG MAGNET 20 X 2 MM", uom: "pcs" },
    { name: "PLAT LEMPENG BESI 20 X 2 MM", uom: "pcs" },
    { name: "MAGNET HARDCOBOX", uom: "pcs" },
    { name: "SENG HARDCBOX 14'", uom: "pcs" },
    { name: "MPS DRYER", uom: "pcs" },
    { name: "QS DRYER", uom: "pcs" },
    { name: "CENTOPLEX GLP - 500", uom: "kg" },
    { name: "BOX COKELAT SINGLEWALL UKURAN 40CM x 26CM x 24CM", uom: "pcs" },
    { name: "FOIL HOTPRINT GREEN ACNE ZONE", uom: "roll" },
    {
      name: "STRETCH FILM UK. 500 MM X 12 MIC X 300 M (WRAPPING)",
      uom: "roll",
    },
    { name: "PLASTIK LDPE 30X45 ANGORA FOR POT CREAM", uom: "kg" },
    { name: "STICKER BONTAX HVS CAMEL 70 X 108", uom: "sheet" },
  ];

  // Material Seed Data (existing code...)
  for (const mat of materials) {
    await db.material.upsert({
      where: { name: mat.name },
      update: { uom: mat.uom },
      create: { name: mat.name, uom: mat.uom },
    });
  }

  // Processes Seed Data
  const processes = [
    { code: "17", name: "CETAK OFFSET" },
    { code: "PT", name: "POTONG KERTAS" },
    { code: "LA", name: "LAMINASI" },
    { code: "UV", name: "UV SPOT" },
    { code: "DC", name: "DIE CUT" },
    { code: "AS", name: "ASSEMBLY" },
    { code: "PK", name: "PACKING" },
    { code: "ST", name: "SORTIR" },
    { code: "FL", name: "HOTPRINT / FOIL" },
    { code: "GL", name: "GLUEING / LEM" },
    { code: "EM", name: "EMBOSS" },
  ];

  for (const proc of processes) {
    await db.process.upsert({
      where: { code: proc.code },
      update: { name: proc.name },
      create: { code: proc.code, name: proc.name },
    });
  }

  const u = await db.user.findUnique({
    where: { username },
    select: { username: true, role: true, passwordHash: true },
  });

  console.log(
    "Seed OK:",
    u?.username,
    u?.role,
    "Machines:",
    machines.length,
    "Materials:",
    materials.length,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
