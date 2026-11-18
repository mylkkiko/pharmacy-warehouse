import { LinkButton } from "@/components/LinkButton/LinkButton"
import { RecentReceiptsTable } from "@/components/RecentReceiptsTable/RecentReceiptsTable"
import prisma from "@/lib/prisma"
import { Group, Stack, Text, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import styles from "../medicines/page.module.css"

export default async function Receipts() {
    const receipts = await prisma.movement.findMany({
        where: { type: "RECEIPT" },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
            batch: {
                include: { medicine: true }
            },
            user: {
                select: { name: true }
            }
        }
    })

    const rows = receipts.map((movement) => ({
        id: movement.id,
        date: movement.createdAt,
        medicine: movement.batch.medicine.name,
        batchNumber: movement.batch.batchNumber,
        expiryDate: movement.batch.expiryDate,
        quantity: movement.quantity,
        unit: movement.batch.medicine.unit,
        unitPrice: Number(movement.batch.unitPrice),
        total: movement.quantity * Number(movement.batch.unitPrice),
        receivedBy: movement.user.name
    }));

    const totalCount = await prisma.movement.count({ where: { type: "RECEIPT" } });

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
