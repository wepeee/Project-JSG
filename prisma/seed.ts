import { PrismaClient } from "../generated/prisma"; // penting: sesuai schema output
import { hash } from "bcryptjs";
import { seedRigid } from "./seed_rigid";

const seedDbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

const db = new PrismaClient(
  seedDbUrl
    ? {
        datasources: {
          db: {
            url: seedDbUrl,
          },
        },
      }
    : undefined,
);

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

  // Create Superadmin Paper
  const saPaper = "superadmin_paper";
  await db.user.upsert({
    where: { username: saPaper },
    update: {
      passwordHash,
      role: "SUPERADMIN",
      department: "PAPER",
    },
    create: {
      username: saPaper,
      passwordHash,
      role: "SUPERADMIN",
      department: "PAPER",
    },
  });

  // Create Superadmin Rigid
  const saRigid = "superadmin_rigid";
  await db.user.upsert({
    where: { username: saRigid },
    update: {
      passwordHash,
      role: "SUPERADMIN",
      department: "RIGID",
    },
    create: {
      username: saRigid,
      passwordHash,
      role: "SUPERADMIN",
      department: "RIGID",
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

  // Create Admin User
  const adminUser = "admin";
  const adminPass = "admin";
  const adminHash = await hash(adminPass, 12);

  await db.user.upsert({
    where: { username: adminUser },
    update: {
      passwordHash: adminHash,
      role: "ADMIN",
    },
    create: {
      username: adminUser,
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Create Admin Paper
  const adminPaperUser = "admin_paper";
  const adminPaperPass = "admin_paper";
  const adminPaperHash = await hash(adminPaperPass, 12);

  await db.user.upsert({
    where: { username: adminPaperUser },
    update: {
      passwordHash: adminPaperHash,
      role: "ADMIN",
      department: "PAPER",
    },
    create: {
      username: adminPaperUser,
      passwordHash: adminPaperHash,
      role: "ADMIN",
      department: "PAPER",
    },
  });

  // Create Admin Rigid
  const adminRigidUser = "admin_rigid";
  const adminRigidPass = "admin_rigid";
  const adminRigidHash = await hash(adminRigidPass, 12);

  await db.user.upsert({
    where: { username: adminRigidUser },
    update: {
      passwordHash: adminRigidHash,
      role: "ADMIN",
      department: "RIGID",
    },
    create: {
      username: adminRigidUser,
      passwordHash: adminRigidHash,
      role: "ADMIN",
      department: "RIGID",
    },
  });

  // Create Operator User
  const opUser = "operator";
  const opPass = "operator";
  const opHash = await hash(opPass, 12);

  await db.user.upsert({
    where: { username: opUser },
    update: {
      passwordHash: opHash,
      role: "OPERATOR",
    },
    create: {
      username: opUser,
      passwordHash: opHash,
      role: "OPERATOR",
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

  // Materials Seed Data (with PN codes from master data)
  const materials: { code: string; name: string; uom: string }[] = [
    { code: "2041066", name: "PETRO DRIER", uom: "kg" },
    { code: "2061007", name: "TINTA ASP PROCESS BLACK", uom: "kg" },
    { code: "2061195", name: "TINTA OFFSET - TC 7000 WHITE", uom: "kg" },
    { code: "2061192", name: "TINTA TC 0001 MEDIUM", uom: "kg" },
    { code: "2061198", name: "TINTA TC 1705 DEEP RED", uom: "kg" },
    {
      code: "2061012",
      name: "TINTA IB MS GLOW FLAP LIGHT GREEN KOSMETIKA",
      uom: "kg",
    },
    {
      code: "2061162",
      name: "TINTA OFFSET - IB MS GLOW DSR TULISAN TREATMENT LIGHT GREEN",
      uom: "kg",
    },
    { code: "2061199", name: "TINTA TC 1705 DEEP RED", uom: "kg" },
    {
      code: "2061182",
      name: "TINTA OFFSET - IB TC 4202 C LIGHT GREEN",
      uom: "kg",
    },
    { code: "2061186", name: "TINTA CEMATO - IB BEEGANIC PINK", uom: "kg" },
    { code: "2061150", name: "TINTA CEMATO - IB HEMPIRE BLUE", uom: "kg" },
    { code: "2061178", name: "TINTA OFFSET - IB SAFFRESKIN PINK", uom: "kg" },
    {
      code: "2061177",
      name: "TINTA CEMATO - IB RANS BEAUTY YELLOW",
      uom: "kg",
    },
    {
      code: "2061170",
      name: "TINTA CEMATO - IB RANS BEAUTY DARK BROWN",
      uom: "kg",
    },
    {
      code: "2061172",
      name: "TINTA CEMATO - IB RANS BEAUTY LIGHT CREAM 3",
      uom: "kg",
    },
    {
      code: "2061174",
      name: "TINTA CEMATO - IB RANS BEAUTY LIGHT YELLOW 2",
      uom: "kg",
    },
    {
      code: "2061173",
      name: "TINTA CEMATO - IB RANS BEAUTY LIGHT GREEN NO 3",
      uom: "kg",
    },
    {
      code: "2061171",
      name: "TINTA CEMATO - IB RANS BEAUTY LIGHT BLUE 2",
      uom: "kg",
    },
    { code: "2061166", name: "TINTA IB P 510 C PINK NO. 2", uom: "kg" },
    {
      code: "2061175",
      name: "TINTA OFFSET - IB RANS BEAUTY P 7502 C CREAM",
      uom: "kg",
    },
    { code: "2061196", name: "TINTA TC 5500 BLACK", uom: "kg" },
    {
      code: "2061129",
      name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - YELLOW",
      uom: "kg",
    },
    {
      code: "2061127",
      name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - CYAN",
      uom: "kg",
    },
    {
      code: "2061126",
      name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - BLACK",
      uom: "kg",
    },
    {
      code: "2061128",
      name: "TINTA OFFSET - BEST ONE NEXUS Z PROCESS - MAGENTA",
      uom: "kg",
    },
    {
      code: "2061168",
      name: "TINTA OFFSET - IB P 7502 C LIGHT BROWN",
      uom: "kg",
    },
    { code: "2061160", name: "TINTA IB MOIN BLUE", uom: "kg" },
    { code: "2061161", name: "TINTA IB MOIN ORANGE", uom: "kg" },
    { code: "2061180", name: "TINTA IB SKINTHEORY GREEN", uom: "kg" },
    { code: "2061119", name: "TINTA ASP KOSME BLACK", uom: "kg" },
    { code: "2061120", name: "ASP MS GLOW YELLOW NO. 2", uom: "kg" },
    {
      code: "4061017",
      name: "KERTAS ART CARTON 360GSM UK. 109 X 79 PD G.O LUXE",
      uom: "sheet",
    },
    { code: "4061067", name: "LEM PF 6259", uom: "kg" },
    { code: "4051096", name: "STIKER BONTAC CAMEL UK. 54 * 70", uom: "sheet" },
    { code: "4061013", name: "IVORY VA RDD 300 GSM 79 X 109 CM", uom: "sheet" },
    { code: "2041197", name: "TINTA PRINT MANUAL - 37-S/ 75 BLACK", uom: "kg" },
    { code: "2171090", name: "SPOT UV AROCOAT 6165", uom: "kg" },
    {
      code: "2051111",
      name: "TINTA DIGITAL PRINTING - VERSAFIRE CV/EV TONER WHITE",
      uom: "kg",
    },
    { code: "2061116", name: "TINTA ECO INK - PC1080 #2 CYAN", uom: "kg" },
    { code: "2061117", name: "TINTA ECO INK - PC1080 #2 MAGENTA", uom: "kg" },
    { code: "2061118", name: "TINTA ECO INK - PC1080 #2 YELLOW", uom: "kg" },
    { code: "2171200", name: "UV SPOT", uom: "kg" },
    { code: "4061087", name: "SAPHIRA FOUNT 511", uom: "kg" },
    { code: "4061088", name: "SAPHIRA IPA TECH 25 LITER", uom: "kg" },
    { code: "4051094", name: "STIKER VINYL TRANSPARANT", uom: "sheet" },
    { code: "4051102", name: "STIKER VINYL GLOSSY WHITE", uom: "sheet" },
    { code: "4051104", name: "STIKER VINYL METALIZE", uom: "sheet" },
    {
      code: "4061018",
      name: "KERTAS ART CARTOON 360GSM UK. 109 X 79 G. DELUXE",
      uom: "sheet",
    },
    {
      code: "4061044",
      name: "KERTAS IVORY 350GSM UK. 790 X 1090",
      uom: "sheet",
    },
    {
      code: "4061020",
      name: "KERTAS ART PAPER 150GSM NEVIA UK. 79X109",
      uom: "sheet",
    },
    {
      code: "4061021",
      name: "KERTAS ART PAPER 310GSM UK. 109 X 79",
      uom: "sheet",
    },
    {
      code: "4061027",
      name: "KERTAS CELLO BOARD SILVER 325GSM UK.109X79",
      uom: "sheet",
    },
    {
      code: "4061028",
      name: "KERTAS CELLO BOARD SILVER 325GSM UK.73 X 53",
      uom: "sheet",
    },
    {
      code: "4061048",
      name: "KERTAS LINTEC PAPER A3+ ( UK. 325X485 )",
      uom: "sheet",
    },
    {
      code: "4061023",
      name: "KERTAS BRITE PAPER A3+ 120GSM (UK. 32.5 X 48.5 )",
      uom: "sheet",
    },
    {
      code: "4111072",
      name: "OPP THERMAL DOFF 18 MIC UK. 52X3000 (28.08 KG)",
      uom: "roll",
    },
    {
      code: "4111077",
      name: "OPP THERMAL GLOSSY 18 MIC - UK. 52 X 3000 (28,08 KG)",
      uom: "roll",
    },
    {
      code: "4111074",
      name: "OPP THERMAL GLOSSY 18 MIC - UK. 32 X 2000 (11,52 KG)",
      uom: "roll",
    },
    {
      code: "4111082",
      name: "OPP THERMAL GLOSSY 18 MIC UK. 580X3000 (28.81 KG)",
      uom: "roll",
    },
    {
      code: "4111068",
      name: "OPP THERMAL DOFF 18 MIC - UK. 32 X 3000 (17,28 KG)",
      uom: "roll",
    },
    {
      code: "4111075",
      name: "OPP THERMAL GLOSSY 18 MIC - UK. 32 X 3000 (17,28 KG)",
      uom: "roll",
    },
    { code: "4111009", name: "FOIL EMAS FOR HOTPRINT", uom: "roll" },
    {
      code: "4061215",
      name: "KERTAS IVORY 250GSM UK. 790 X 1090",
      uom: "sheet",
    },
    { code: "5061202", name: "WASH UP CLOTH", uom: "pcs" },
    {
      code: "4061029",
      name: "KERTAS CELLO BOARD SILVER 325GSM UK.73 X 53",
      uom: "sheet",
    },
    { code: "2061189", name: "SAPHIRA INK JAZZ 100 CYAN", uom: "kg" },
    { code: "2061188", name: "SAPHIRA INK JAZZ 100 BLACK", uom: "kg" },
    { code: "2061191", name: "SAPHIRA INK JAZZ 100 YELLOW", uom: "kg" },
    { code: "5061028", name: "ROLLIN TBC1 3 PLY 772X627X1 96", uom: "pcs" },
    { code: "2061204", name: "TINTA OFFSET - IB MAVIOR CREAM", uom: "kg" },
    { code: "2061206", name: "TINTA OFFSET - RED FABLY", uom: "kg" },
    { code: "2061207", name: "TINTA OFFSET - DARK BLUE FABLY", uom: "kg" },
    { code: "2061209", name: "TINTA OFFSET - PINK DEWYGLOW SERUM", uom: "kg" },
    {
      code: "2061205",
      name: "TINTA OFFSET - GREEN DEW MOISTURIZER",
      uom: "kg",
    },
    {
      code: "2061208",
      name: "TINTA OFFSET - LIGHT BLUE DEW BRIGHTENING ESSENCE",
      uom: "kg",
    },
    { code: "4191217", name: "FOIL HOTPRINT SILVER 64 X 120", uom: "roll" },
    { code: "4191214", name: "FOIL HOTPRINT GOLD UK. 64 X 120", uom: "roll" },
    { code: "2061149", name: "TINTA IB GREEN ACNE SPOT", uom: "kg" },
    { code: "2061165", name: "TINTA IB ORANGE DARK SPOT", uom: "kg" },
    {
      code: "4061030",
      name: "KERTAS IVORY 250 GR IMPORT CM 79 X 109",
      uom: "sheet",
    },
    {
      code: "4051053",
      name: "LARGE FORMAT VINYL TRANSPARANT 1260MM X 50MM",
      uom: "roll",
    },
    {
      code: "4051054",
      name: "LARGE FORMAT VINYL TRANSPARANT UK. 1550 X 50 MM",
      uom: "roll",
    },
    {
      code: "4111084",
      name: "LAMINATING MATTE/DOFF 100 GRAM - PROLAM V70",
      uom: "roll",
    },
    {
      code: "4111083",
      name: "LAMINATING GLOSS 100 GRAM - PROLAM V70",
      uom: "roll",
    },
    {
      code: "4061109",
      name: "T. COS WHITE BACK 230 GR 65 X 100 IK VP S-CARD",
      uom: "sheet",
    },
    {
      code: "4111010",
      name: "FOOPAK SL MATT 1/S PE GCI GR 79 X 109 IK",
      uom: "sheet",
    },
    {
      code: "4061219",
      name: "TINTA OFFSET - IB DEOKSI TONER ORANGE",
      uom: "kg",
    },
    {
      code: "4061220",
      name: "TINTA OFFSET - VS DEOKSI TONER ORANGE",
      uom: "kg",
    },
    { code: "4061227", name: "KERTAS ART PAPER 85 79 X 109", uom: "sheet" },
    { code: "4061226", name: "KERTAS ART PAPER 120 79 X 109", uom: "sheet" },
    {
      code: "4061222",
      name: "TINTA VS MMM NOBU RATTAN STOOL BRONZE BLUE",
      uom: "kg",
    },
    {
      code: "4061221",
      name: "TINTA MMM GREEN PLASTIC SCRAPPER (KAPE)",
      uom: "kg",
    },
    { code: "4061223", name: "TINTA MMM GREEN PAINT TRAY", uom: "kg" },
    { code: "4061224", name: "TINTA MMM PURPLE PAINT TRAY", uom: "kg" },
    { code: "4061230", name: "OPV CTW GLOSSY", uom: "kg" },
    { code: "4061228", name: "MIKA PVC UK. 50M x 140M", uom: "roll" },
    { code: "2061228", name: "TINTA PURPLE HOMEDECO MMM", uom: "kg" },
    { code: "2061229", name: "TINTA YELLOW HOMEDECO MMM", uom: "kg" },
    { code: "4061231", name: "SAPHIRA UN SPEED 450 YELLOW 2.5 KG", uom: "kg" },
    { code: "4061232", name: "SAPHIRA UN SPEED 450 BLACK 2.5 KG", uom: "kg" },
    {
      code: "4061218",
      name: "TINTA OFFSET - IB MS GLOW SALMON DNA LIGHT PINK",
      uom: "kg",
    },
    {
      code: "4061016",
      name: "KARTON KUNING NO. 30 1200GSM UK. 77X 65",
      uom: "sheet",
    },
    { code: "4061235", name: "STICKER BONTAC UK. 65 X 100", uom: "sheet" },
    { code: "4061062", name: "MIKA PVC UK. 18,5 X 16,5", uom: "pcs" },
    { code: "4061061", name: "MIKA PVC RIGID UK. 0,15", uom: "pcs" },
    {
      code: "4061233",
      name: "DUPLEX BACK GREY 250 GSM UK. 65 X 100",
      uom: "sheet",
    },
    {
      code: "4191236",
      name: "FOIL HOTPRINT SILVER MU8 AL UK. 610MM X 122M",
      uom: "roll",
    },
    {
      code: "4061245",
      name: "DUPLEX BACK GREY 250 GSM UK. 79 x 109",
      uom: "sheet",
    },
    {
      code: "4061286",
      name: "DUPLEX BACK GREY 350 GSM UK. 79 X 109",
      uom: "sheet",
    },
    { code: "4061214", name: "SAPHIRA UN SPEED 450 CYAN 2.5 KG", uom: "kg" },
    { code: "4061244", name: "OPV CTW DOFF", uom: "kg" },
    { code: "4061241", name: "TINTA TRIPPSY HOTTIE CARMINE YELLOW", uom: "kg" },
    { code: "406124", name: "TINTA TRIPPSY CHERISH CRUSH MAGENTA", uom: "kg" },
    { code: "4061237", name: "TINTA TRIPPSY AMY RUBY RED", uom: "kg" },
    { code: "4061239", name: "TINTA TRIPPSY SEXXY MARROON RED", uom: "kg" },
    { code: "4061243", name: "TINTA TRIPPSY PINKY MOIST BLUE", uom: "kg" },
    { code: "4061238", name: "TINTA TRIPPSY SHINE MACCAROON GREEN", uom: "kg" },
    { code: "4061242", name: "TINTA TRIPPSY FLIRTY NUDE VIOLET", uom: "kg" },
    { code: "2061246", name: "TINTA OFFSET - IB PORE AWAY BLUE", uom: "kg" },
    { code: "4061248", name: "FOIL HOTPRINT UNGU UK. 64 X 120", uom: "roll" },
    { code: "4061249", name: "FOIL HOTPRINT MERAH UK. 64 X 120", uom: "roll" },
    { code: "4061225", name: "KERTAS IVORY 250GSM UK. 79 X 109", uom: "sheet" },
    { code: "2061251", name: "TINTA ART PAPER BAG SUGAR BOMB RED", uom: "kg" },
    { code: "4061255", name: "TINTA AF ST VOLT REFLEX BLUE", uom: "kg" },
    { code: "4061256", name: "TINTA AF P. COOL GREY 10 C", uom: "kg" },
    { code: "4061253", name: "STICKER VINYL PET METALIZE", uom: "sheet" },
    {
      code: "4031258",
      name: "SPONS EVA TEBAL 5 MM UK. 100 X 200 CM",
      uom: "pcs",
    },
    { code: "2061264", name: "TINTA IB CALM METALIC GREEN", uom: "kg" },
    { code: "2061265", name: "TINTA IB HYDRA METALIC BLUE", uom: "kg" },
    { code: "2061266", name: "TINTA IB MAXI METALIC ORANGE", uom: "kg" },
    { code: "2061263", name: "TINTA ASP MAGENTA DUAL CREAM", uom: "kg" },
    { code: "2061262", name: "TINTA ASP YELLOW DUAL CREAM", uom: "kg" },
    { code: "5041005", name: "CENTRALON RHU 70 25X5X3600 MM BS", uom: "pcs" },
    {
      code: "5171011",
      name: "GRAFTAC SEALING FOIL 50 MM X 100 M",
      uom: "roll",
    },
    { code: "5041050", name: "YY-53 RETARDER ( SLOW )", uom: "kg" },
    { code: "5061038", name: "SAPHIRA PN REPLERNISHER 20L", uom: "pcs" },
    { code: "5061037", name: "SAPHIRA PN DEVELOPHER 20L", uom: "pcs" },
    { code: "5061046", name: "SAPHIRA WATER CONDITIONER", uom: "kg" },
    { code: "5061044", name: "SAPHIRA WASH 561", uom: "kg" },
    { code: "5061045", name: "SAPHIRA WASH 562", uom: "kg" },
    { code: "5061047", name: "SAPHIRA WATER FIX", uom: "kg" },
    { code: "5061031", name: "SAPHIRA CTP PREMIUM PLATE FINISHER", uom: "pcs" },
    { code: "5061034", name: "SAPHIRA PA 27 745 X 605", uom: "pcs" },
    {
      code: "5061036",
      name: "SAPHIRA PLATE CTPPQ2 27X745X605 PKT 60",
      uom: "pcs",
    },
    { code: "5031014", name: "KERTAS SAMSON", uom: "sheet" },
    { code: "5061042", name: "SAPHIRA SPRAY POWDER ST 35", uom: "kg" },
    { code: "5061040", name: "SAPHIRA SPRAY CP MEDIUM", uom: "kg" },
    { code: "5061029", name: "SAPHIRA BLANKET CONDITIONER", uom: "kg" },
    { code: "5061039", name: "SAPHIRA ROLLER PASTE 700ML", uom: "pcs" },
    {
      code: "5171004",
      name: "CENTRALON ORTECH 300 50X9X3810MM 75 SH POBC265 GREEN",
      uom: "pcs",
    },
    { code: "5061032", name: "SAPHIRA DUMP CLEAN COMBI", uom: "kg" },
    { code: "5061030", name: "SAPHIRA CHROME CONDITIONER", uom: "kg" },
    { code: "5061035", name: "SAPHIRA PLATE CLEANER", uom: "kg" },
    { code: "5061053", name: "SAPHIRA BLANKET CLEANER", uom: "kg" },
    { code: "5031085", name: "PLAT LEMPENG BESI MAGNET 12MM", uom: "pcs" },
    { code: "5041002", name: "THINNER PPC-070", uom: "kg" },
    { code: "5041001", name: "SCREEN CLEANER", uom: "kg" },
    { code: "5031052", name: "ISOLASI OPP DAIMARU UK.48 MM", uom: "pcs" },
    { code: "5061054", name: "PLAT LEMPENG MAGNET 20 X 2 MM", uom: "pcs" },
    { code: "5061055", name: "PLAT LEMPENG BESI 20 X 2 MM", uom: "pcs" },
    { code: "5061057", name: "MAGNET HARDCOBOX", uom: "pcs" },
    { code: "5061058", name: "SENG HARDCBOX 14'", uom: "pcs" },
    { code: "5061059", name: "MPS DRYER", uom: "pcs" },
    { code: "5061060", name: "QS DRYER", uom: "pcs" },
    { code: "5061003", name: "CENTOPLEX GLP - 500", uom: "kg" },
    {
      code: "5061061",
      name: "BOX COKELAT SINGLEWALL UKURAN 40CM x 26CM x 24CM",
      uom: "pcs",
    },
    { code: "4061283", name: "FOIL HOTPRINT GREEN ACNE ZONE", uom: "roll" },
    {
      code: "6031001",
      name: "STRETCH FILM UK. 500 MM X 12 MIC X 300 M (WRAPPING)",
      uom: "roll",
    },
    {
      code: "6031012",
      name: "PLASTIK LDPE 30X45 ANGORA FOR POT CREAM",
      uom: "kg",
    },
    {
      code: "STICKER_BONTAX_HVS_CAMEL_70_X_108",
      name: "STICKER BONTAX HVS CAMEL 70 X 108",
      uom: "sheet",
    },
  ];

  // Seed materials as Item records (unified master)
  for (const mat of materials) {
    await db.item.upsert({
      where: { code: mat.code },
      update: { name: mat.name, baseUom: mat.uom },
      create: {
        code: mat.code,
        name: mat.name,
        kind: "RAW",
        status: "ACTIVE",
        baseUom: mat.uom,
        createdFrom: "SEED",
      },
    });
  }

  // --- Run Rigid Seeding ---
  await seedRigid(db);

  // Processes Seed Data
  const processes = [
    { code: "11", name: "INJECTION MOLDING" },
    { code: "12", name: "EXTRUCTION BLOW MOLDING" },
    { code: "13", name: "ASSEMBLY" },
    { code: "14", name: "SCREEN PRINTING" },
    { code: "15", name: "VERSAFIRE C 7200X" },
    { code: "16", name: "DIGITAL PRINTING" },
    { code: "17", name: "OFFSET PRINTING PHASE #1" },
    { code: "18", name: "PAD PRINTING" },
    { code: "19", name: "DIE CUTTING" },
    { code: "20", name: "FOLDED & GLUE" },
    { code: "21", name: "REWORK" },
    { code: "22", name: "OFFSET PRINTING PHASE #2" },
    { code: "23", name: "KISSCUT" },
    { code: "a3", name: "SK PRINTING/PRINTING MANUAL" },
    { code: "24", name: "JASA PEMASANGAN STIKER" },
    { code: "25", name: "CTP SUPRASETTER" },
    { code: "26", name: "JWEI" },
    { code: "27", name: "LAMINASI" },
    { code: "28", name: "UV SPOT" },
    { code: "29", name: "FG" },
    { code: "30", name: "SCREEN TRAIN OS - CA" },
  ];

  const rigidCodes = ["11", "12", "14", "29"];
  for (const proc of processes) {
    const isRigid = rigidCodes.includes(proc.code);
    const type = isRigid ? "RIGID" : "PAPER";

    await db.proPrefix.upsert({
      where: { code: proc.code },
      update: { name: proc.name, type },
      create: { code: proc.code, name: proc.name, type },
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
