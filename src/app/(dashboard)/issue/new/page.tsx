import { IssueForm } from "@/components/IssueForm/IssueForm";
import { medicineService } from "@/server/container";
import { Paper } from "@mantine/core";

export default async function CreateIssuePage() {
    const medicines = await medicineService.list("");

    const medicineOptions = medicines.map((medicine) => ({
        value: medicine.id,
        label: `${medicine.name} ${medicine.dosage}`,
        unit: medicine.unit
    }));

    return (
        <Paper withBorder p="lg" maw={700}>
            <IssueForm medicineOptions={medicineOptions} />
        </Paper>
    )
}
