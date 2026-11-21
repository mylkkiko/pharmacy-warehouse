import { ReceiptForm } from "@/components/ReceiptForm/ReceiptForm";
import { medicineService } from "@/server/container";
import { Center } from "@mantine/core";

export default async function CreateReceiptPage () {
    const medicines = await medicineService.list("");

    const medicineOptions = medicines.map((medicine) => ({
        value: medicine.id,
        label: `${medicine.name} ${medicine.dosage}`,
        unit: medicine.unit
    }));

    return (
        <Center py="xl">
            <ReceiptForm medicineOptions={medicineOptions} />
        </Center>
    )
}