import { LinkButton } from "@/components/LinkButton/LinkButton";
import { MedicinesTable } from "@/components/MedicinesTable/MedicinesTable";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import styles from "./page.module.css";
import { medicineService } from "@/server/container";

export default async function MedicinesPage(props: PageProps<"/medicines">) {
    const { q } = await props.searchParams;
    const search = typeof q === "string" ? q.trim() : "";
    const rows = await medicineService.list(search);
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
                    <SearchInput placeholder="Search by name or ingredient..." />
                    <LinkButton href="/medicines/new" leftSection={<IconPlus size={18} stroke={2} />}>
                        Add medicine
                    </LinkButton>
                </Group>
            </Group>

            <MedicinesTable medicines={rows} />
        </>
    )
}
