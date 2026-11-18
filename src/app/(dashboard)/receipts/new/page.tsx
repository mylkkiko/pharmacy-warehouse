import { ReceiptForm } from "@/components/ReceiptForm/ReceiptForm";
import prisma from "@/lib/prisma";
import { Paper } from "@mantine/core";

export default async function CreateReceiptPage () {
    const medicines = await prisma.medicine.findMany({
        select: { id: true, name: true, dosage: true, unit: true },
        orderBy: { name: "asc" }
    });

    const medicineOptions = medicines.map((medicine) => ({
        value: medicine.id,
        label: `${medicine.name} ${medicine.dosage}`,
        unit: medicine.unit
    }));

    return (
        <Paper withBorder p="lg" maw={700}>
            <ReceiptForm medicineOptions={medicineOptions} />
        </Paper>
    )
}