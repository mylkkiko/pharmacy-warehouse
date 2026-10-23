import "dotenv/config";
import { Batch, Medicine, PrismaClient, User } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const getMedicineId = (medicines: Medicine[], name: string) => {
  const medicine = medicines.find((m) => m.name === name);
  if (!medicine) {
    throw new Error(`Medicine with name ${name} not found`);
  }
  return medicine.id;
};

const getBatchId = (batches: Batch[], batchNumber: string) => {
  const batch = batches.find((b) => b.batchNumber === batchNumber);
  if (!batch) {
    throw new Error(`Batch with number ${batchNumber} not found`);
  }
  return batch.id;
};

const getUserId = (users: User[], email: string) => {
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }
  return user.id;
};

const start = async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Movement" CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Batch" CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Medicine" CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`);
  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Admin User",
        email: "admin@pharmacy.test",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
      {
        name: "Jane Smith",
        email: "pharmacist@pharmacy.test",
        passwordHash: await bcrypt.hash("pharm123", 10),
      },
    ],
  });
  const medicines = await prisma.medicine.createManyAndReturn({
    data: [
      {
        name: "Paracetamol",
        activeIngredient: "Paracetamol",
        form: "Tablets",
        dosage: "500 mg",
        unit: "pcs",
        minStock: 200,
      },
      {
        name: "Ibuprofen",
        activeIngredient: "Ibuprofen",
        form: "Tablets",
        dosage: "400 mg",
        unit: "pcs",
        minStock: 150,
      },
      {
        name: "Amoxicillin",
        activeIngredient: "Amoxicillin",
        form: "Capsules",
        dosage: "500 mg",
        unit: "pcs",
        minStock: 100,
      },
      {
        name: "Ceftriaxone",
        activeIngredient: "Ceftriaxone",
        form: "Powder for injection",
        dosage: "1 g",
        unit: "vials",
        minStock: 50,
      },
      {
        name: "Sodium Chloride",
        activeIngredient: "Sodium Chloride",
        form: "Solution for infusion",
        dosage: "0.9%, 500 ml",
        unit: "bottles",
        minStock: 100,
      },
      {
        name: "Heparin",
        activeIngredient: "Heparin sodium",
        form: "Solution for injection",
        dosage: "5000 IU/ml",
        unit: "ampoules",
        minStock: 40,
      },
      {
        name: "Omeprazole",
        activeIngredient: "Omeprazole",
        form: "Capsules",
        dosage: "20 mg",
        unit: "pcs",
        minStock: 120,
      },
      {
        name: "Metamizole",
        activeIngredient: "Metamizole sodium",
        form: "Solution for injection",
        dosage: "500 mg/ml, 2 ml",
        unit: "ampoules",
        minStock: 60,
      },
      {
        name: "Insulin Regular",
        activeIngredient: "Insulin human",
        form: "Solution for injection",
        dosage: "100 IU/ml, 10 ml",
        unit: "vials",
        minStock: 20,
      },
      {
        name: "Lidocaine",
        activeIngredient: "Lidocaine hydrochloride",
        form: "Solution for injection",
        dosage: "2%, 2 ml",
        unit: "ampoules",
        minStock: 50,
      },
    ],
  });
  const batches = await prisma.batch.createManyAndReturn({
    data: [
      {
        batchNumber: "PAR-2401",
        expiryDate: dayjs().add(18, "month").toDate(),
        quantity: 500,
        receivedAt: dayjs().subtract(40, "day").toDate(),
        supplier: "MedSupply Co.",
        medicineId: getMedicineId(medicines, "Paracetamol"),
      },
      {
        batchNumber: "PAR-2402",
        expiryDate: dayjs().add(15, "day").toDate(),
        quantity: 80,
        receivedAt: dayjs().subtract(200, "day").toDate(),
        supplier: "MedSupply Co.",
        medicineId: getMedicineId(medicines, "Paracetamol"),
      },
      {
        batchNumber: "IBU-2401",
        expiryDate: dayjs().add(12, "month").toDate(),
        quantity: 90,
        receivedAt: dayjs().subtract(20, "day").toDate(),
        supplier: "PharmaLine Ltd.",
        medicineId: getMedicineId(medicines, "Ibuprofen"),
      },
      {
        batchNumber: "AMX-2401",
        expiryDate: dayjs().subtract(10, "day").toDate(),
        quantity: 40,
        receivedAt: dayjs().subtract(300, "day").toDate(),
        supplier: "PharmaLine Ltd.",
        medicineId: getMedicineId(medicines, "Amoxicillin"),
      },
      {
        batchNumber: "AMX-2402",
        expiryDate: dayjs().add(10, "month").toDate(),
        quantity: 200,
        receivedAt: dayjs().subtract(15, "day").toDate(),
        supplier: "PharmaLine Ltd.",
        medicineId: getMedicineId(medicines, "Amoxicillin"),
      },
      {
        batchNumber: "CEF-2401",
        expiryDate: dayjs().add(24, "month").toDate(),
        quantity: 120,
        receivedAt: dayjs().subtract(30, "day").toDate(),
        supplier: "HealthDistrib Inc.",
        medicineId: getMedicineId(medicines, "Ceftriaxone"),
      },
      {
        batchNumber: "NACL-2401",
        expiryDate: dayjs().add(20, "day").toDate(),
        quantity: 300,
        receivedAt: dayjs().subtract(180, "day").toDate(),
        supplier: "HealthDistrib Inc.",
        medicineId: getMedicineId(medicines, "Sodium Chloride"),
      },
      {
        batchNumber: "HEP-2401",
        expiryDate: dayjs().add(8, "month").toDate(),
        quantity: 25,
        receivedAt: dayjs().subtract(25, "day").toDate(),
        supplier: "MedSupply Co.",
        medicineId: getMedicineId(medicines, "Heparin"),
      },
      {
        batchNumber: "OME-2401",
        expiryDate: dayjs().add(14, "month").toDate(),
        quantity: 240,
        receivedAt: dayjs().subtract(35, "day").toDate(),
        supplier: "PharmaLine Ltd.",
        medicineId: getMedicineId(medicines, "Omeprazole"),
      },
      {
        batchNumber: "MET-2401",
        expiryDate: dayjs().subtract(5, "day").toDate(),
        quantity: 30,
        receivedAt: dayjs().subtract(250, "day").toDate(),
        supplier: "HealthDistrib Inc.",
        medicineId: getMedicineId(medicines, "Metamizole"),
      },
      {
        batchNumber: "MET-2402",
        expiryDate: dayjs().add(12, "month").toDate(),
        quantity: 100,
        receivedAt: dayjs().subtract(10, "day").toDate(),
        supplier: "HealthDistrib Inc.",
        medicineId: getMedicineId(medicines, "Metamizole"),
      },
      {
        batchNumber: "INS-2401",
        expiryDate: dayjs().add(25, "day").toDate(),
        quantity: 15,
        receivedAt: dayjs().subtract(60, "day").toDate(),
        supplier: "MedSupply Co.",
        medicineId: getMedicineId(medicines, "Insulin Regular"),
      },
      {
        batchNumber: "LID-2401",
        expiryDate: dayjs().add(12, "month").toDate(),
        quantity: 150,
        receivedAt: dayjs().subtract(45, "day").toDate(),
        supplier: "MedSupply Co.",
        medicineId: getMedicineId(medicines, "Lidocaine"),
      },
    ],
  });
  await prisma.movement.createMany({
    data: [
      {
        type: "RECEIPT",
        quantity: 600,
        createdAt: dayjs().subtract(40, "day").toDate(),
        batchId: getBatchId(batches, "PAR-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 80,
        createdAt: dayjs().subtract(200, "day").toDate(),
        batchId: getBatchId(batches, "PAR-2402"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 90,
        createdAt: dayjs().subtract(20, "day").toDate(),
        batchId: getBatchId(batches, "IBU-2401"),
        userId: getUserId(users, "admin@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 40,
        createdAt: dayjs().subtract(300, "day").toDate(),
        batchId: getBatchId(batches, "AMX-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 200,
        createdAt: dayjs().subtract(15, "day").toDate(),
        batchId: getBatchId(batches, "AMX-2402"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 150,
        createdAt: dayjs().subtract(30, "day").toDate(),
        batchId: getBatchId(batches, "CEF-2401"),
        userId: getUserId(users, "admin@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 300,
        createdAt: dayjs().subtract(180, "day").toDate(),
        batchId: getBatchId(batches, "NACL-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 25,
        createdAt: dayjs().subtract(25, "day").toDate(),
        batchId: getBatchId(batches, "HEP-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 300,
        createdAt: dayjs().subtract(35, "day").toDate(),
        batchId: getBatchId(batches, "OME-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 30,
        createdAt: dayjs().subtract(250, "day").toDate(),
        batchId: getBatchId(batches, "MET-2401"),
        userId: getUserId(users, "admin@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 100,
        createdAt: dayjs().subtract(10, "day").toDate(),
        batchId: getBatchId(batches, "MET-2402"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 15,
        createdAt: dayjs().subtract(60, "day").toDate(),
        batchId: getBatchId(batches, "INS-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "RECEIPT",
        quantity: 150,
        createdAt: dayjs().subtract(45, "day").toDate(),
        batchId: getBatchId(batches, "LID-2401"),
        userId: getUserId(users, "admin@pharmacy.test"),
      },
    ],
  });
  await prisma.movement.createMany({
    data: [
      {
        type: "ISSUE",
        quantity: 100,
        note: "Issued to Surgery",
        createdAt: dayjs().subtract(10, "day").toDate(),
        batchId: getBatchId(batches, "PAR-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "ISSUE",
        quantity: 30,
        note: "Issued to ICU",
        createdAt: dayjs().subtract(7, "day").toDate(),
        batchId: getBatchId(batches, "CEF-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
      {
        type: "ISSUE",
        quantity: 60,
        note: "Issued to Therapy",
        createdAt: dayjs().subtract(3, "day").toDate(),
        batchId: getBatchId(batches, "OME-2401"),
        userId: getUserId(users, "pharmacist@pharmacy.test"),
      },
    ],
  });
};

start()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
