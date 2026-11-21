import { FinancePeriodFilter } from "@/components/FinancePeriodFilter/FinancePeriodFilter";
import { RecentReceiptsTable } from "@/components/RecentReceiptsTable/RecentReceiptsTable";
import { CURRENCY } from "@/lib/constants";
import { financeService } from "@/server/container";
import { FINANCE_PERIODS, FinancePeriod } from "@/server/services/financeService";
import { Card, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconCash, IconReceipt, IconTrashX } from "@tabler/icons-react";
import { ReactNode } from "react";
import tableStyles from "@/components/MedicinesTable/MedicinesTable.module.css";
import headerStyles from "../medicines/page.module.css";
import styles from "./page.module.css";

type StatCardProps = {
    title: string,
    value: string,
    icon: ReactNode,
    danger?: boolean
}

const StatCard = ({ title, value, icon, danger }: StatCardProps) => (
    <Card withBorder padding="lg" className={`${tableStyles.card} ${styles.card} ${danger ? styles.danger : ""}`}>
        <Group justify="space-between" wrap="nowrap">
            <Text className={styles.cardTitle}>{title}</Text>
            <span className={styles.icon}>{icon}</span>
        </Group>
        <Text className={styles.value}>{value}</Text>
    </Card>
);

const formatMoney = (value: number) => `${CURRENCY}${value.toFixed(2)}`;

export default async function FinancePage(props: PageProps<"/finance">) {
    const { period } = await props.searchParams;
    const selected: FinancePeriod = FINANCE_PERIODS.find((value) => value === period) ?? "month";

    const { totalSpent, receiptsCount, writeOffLoss, receipts } = await financeService.getSummary(selected);

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={headerStyles.header}>
                <Title order={2} className={headerStyles.title}>Finance</Title>
                <FinancePeriodFilter />
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
                <StatCard title="Total spent" value={formatMoney(totalSpent)} icon={<IconCash size={22} stroke={1.7} />} />
                <StatCard title="Receipts" value={String(receiptsCount)} icon={<IconReceipt size={22} stroke={1.7} />} />
                <StatCard title="Write-off losses" value={formatMoney(writeOffLoss)} icon={<IconTrashX size={22} stroke={1.7} />} danger />
            </SimpleGrid>

            <RecentReceiptsTable rows={receipts} />
        </>
    )
}
