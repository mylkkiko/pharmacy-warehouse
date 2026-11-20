import { stockService } from "@/server/container";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import { StockFilter } from "@/components/StockFilter/StockFilter";
import { StockTable } from "@/components/StockTable/StockTable";
import { Group, Stack, Text, Title } from "@mantine/core";
import styles from "../medicines/page.module.css";

export default async function StockPage(props: PageProps<"/stock">) {
    const { q, status } = await props.searchParams;
    const search = typeof q === "string" ? q.trim() : "";
    const filter = typeof status === "string" ? status : "all";
    const rows = await stockService.list(search, filter);

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