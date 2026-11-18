import { MedicineForm } from "@/components/MedicineForm/MedicineForm";
import { createMedicine } from "@/lib/actions/createMedicine";
import { Center } from "@mantine/core";

export default async function CreateMedicinePage () {
    return (
        <Center py="xl">
            <MedicineForm
                action={createMedicine}
                title="Add new medicine"
                description="Fill in the fields below to add a medicine to the warehouse"
                submitLabel="Create"
            />
        </Center>
    )
}
