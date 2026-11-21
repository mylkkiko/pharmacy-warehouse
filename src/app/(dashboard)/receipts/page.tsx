import { LinkButton } from "@/components/LinkButton/LinkButton"
import { RecentReceiptsTable } from "@/components/RecentReceiptsTable/RecentReceiptsTable"
import { receiptService } from "@/server/container"
import { Group, Stack, Text, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import styles from "../medicines/page.module.css"

export default async function Receipts() {
    const [receipts, totalCount] = await Promise.all([
        receiptService.listRecent(20),
        receiptService.count()
    ]);

    const rows = receipts.map((receipt) => ({
        ...receipt,
        total: receipt.quantity * receipt.unitPrice
    }));

    const count = `${totalCount} ${totalCount === 1 ? "receipt" : "receipts"}`;

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={styles.header}>
                <Stack gap={4}>
                    <Title order={2} className={styles.title}>Receipts</Title>
                    <Text size="sm" className={styles.subtitle}>
                        Total: <span className={styles.count}>{count}</span>
                    </Text>
                </Stack>
                <LinkButton href="/receipts/new" leftSection={<IconPlus size={18} stroke={2} />}>
                    New receipt
                </LinkButton>
            </Group>

            <RecentReceiptsTable rows={rows} />
        </>
    )
}
