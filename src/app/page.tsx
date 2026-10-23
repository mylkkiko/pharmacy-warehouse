import prisma from "@/lib/prisma";

export default async function Home() {
  const medicine = await prisma.medicine.count();
  console.log(medicine);
}
