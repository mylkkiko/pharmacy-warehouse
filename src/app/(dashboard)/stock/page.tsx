import { getBatchStatus, getStatusBoundaries } from "@/lib/stock";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import { StockFilter } from "@/components/StockFilter/StockFilter";
import { StockTable } from "@/components/StockTable/StockTable";
import { Group, Stack, Text, Title } from "@mantine/core";
import styles from "../medicines/page.module.css";

export default async function StockPage(props: PageProps<"/stock">) {
    const { q, status } = await props.searchParams;
    const search = typeof q === "string" ? q.trim() : "";
    const filter = typeof status === "string" ? status : "all";
    const { today, soon } = getStatusBoundaries();
    const where: Prisma.BatchWhereInput = { quantity: { gt: 0 } };
    if(search) {
        where.medicine = { name: { contains: search, mode: "insensitive" } }
    }
    if(filter === "expired") {
        where.expiryDate = { lt: today }
    } else if(filter === "expiring") {
        where.expiryDate = { gte: today, lte: soon }
    } else if(filter === "ok") {
        where.expiryDate = { gt: soon }
    }
    const batches = await prisma.batch.findMany({
        where,
        include: {
            medicine: true,
        },
        orderBy: {
            expiryDate: "asc"
        }
    });

    const rows = batches.map((batch) => ({
        id: batch.id,
        medicine: batch.medicine.name,
        dosage: batch.medicine.dosage,
        batchNumber: batch.batchNumber,
        quantity: batch.quantity,
        supplier: batch.supplier,
        receivedAt: batch.receivedAt,
        expiryDate: batch.expiryDate,
        unit: batch.medicine.unit,
        status: getBatchStatus(batch.expiryDate)
    }))

    const count = `${rows.length} ${rows.length === 1 ? "batch" : "batches"}`;

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={styles.header}>
                <Stack gap={4}>
                    <Title order={2} className={styles.title}>Stock</Title>
                    <Text size="sm" className={styles.subtitle}>
                        Total: <span className={styles.count}>{count}</span>
                    </Text>
                </Stack>
                <SearchInput placeholder="Search by medicine name..." />
            </Group>

            <Group mb="md">
                <StockFilter />
            </Group>

            <StockTable rows={rows} />
        </>
    )
}