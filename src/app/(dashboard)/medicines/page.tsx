import { LinkButton } from "@/components/LinkButton/LinkButton";
import { MedicinesTable } from "@/components/MedicinesTable/MedicinesTable";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import prisma from "@/lib/prisma";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import styles from "./page.module.css";

export default async function MedicinesPage(props: PageProps<"/medicines">) {
    const { q } = await props.searchParams;
    const search = typeof q === "string" ? q.trim() : "";

    const medicines = await prisma.medicine.findMany({
        where: search ?
        {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { activeIngredient: { contains: search, mode: "insensitive" } },
            ],
        } : undefined,
        include: {
            batches: {
                select: { quantity: true },
            },
        },
        orderBy: { name: "asc" },
    });

    const rows = medicines.map((medicine) => ({
        id: medicine.id,
        name: medicine.name, 
        activeIngredient: medicine.activeIngredient,
        form: medicine.form,
        dosage: medicine.dosage,
        unit: medicine.unit,
        minStock: medicine.minStock,
        stock: medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0),
    }));

    const count = `${rows.length} ${rows.length === 1 ? "item" : "items"}`;

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={styles.header}>
                <Stack gap={4}>
                    <Title order={2} className={styles.title}>Medicines</Title>
                    <Text size="sm" className={styles.subtitle}>
                        {search ? "Found" : "Total"}: <span className={styles.count}>{count}</span>
                    </Text>
                </Stack>
                <Group gap="sm">
                    <SearchInput />
                    <LinkButton href="/medicines/new" leftSection={<IconPlus size={18} stroke={2} />}>
                        Add medicine
                    </LinkButton>
                </Group>
            </Group>

            <MedicinesTable medicines={rows} />
        </>
    )
}
