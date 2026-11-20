import { MovementsTable } from "@/components/MovementsTable/MovementsTable"
import { movementService } from "@/server/container"
import { Group, Stack, Text, Title } from "@mantine/core"
import styles from "../medicines/page.module.css"

export default async function Movements() {
    const rows = await movementService.list(100);

    const count = `${rows.length} ${rows.length === 1 ? "operation" : "operations"}`;

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={styles.header}>
                <Stack gap={4}>
                    <Title order={2} className={styles.title}>Movements</Title>
                    <Text size="sm" className={styles.subtitle}>
                        Last <span className={styles.count}>{count}</span>
                    </Text>
                </Stack>
            </Group>

            <MovementsTable rows={rows} />
        </>
    )
}
