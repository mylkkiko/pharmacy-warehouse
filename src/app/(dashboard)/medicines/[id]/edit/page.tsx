import { MedicineForm } from "@/components/MedicineForm/MedicineForm";
import { updateMedicine } from "@/lib/actions/updateMedicine";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function UpdateMedicinePage(props: PageProps<"/medicines/[id]/edit">) {
    const { id } = await props.params;
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if(!medicine) {
        return notFound();
    }

    return (
        <MedicineForm
            action={updateMedicine.bind(null, medicine.id)}
            defaultValues={{
                name: medicine.name,
                activeIngredient: medicine.activeIngredient,
                form: medicine.form,
                dosage: medicine.dosage,
                unit: medicine.unit,
                minStock: medicine.minStock,
            }}
            title="Edit medicine"
            submitLabel="Save"
        />
    )
}