import { LinkButton } from "@/components/LinkButton/LinkButton";
import { auth } from "@/lib/auth";
import { dashboardService } from "@/server/container";
import { Card, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconAlertOctagon, IconAlertTriangle, IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ReactNode } from "react";
import tableStyles from "@/components/MedicinesTable/MedicinesTable.module.css";
import headerStyles from "./medicines/page.module.css";
import styles from "./page.module.css";

const MAX_ITEMS = 5;

type SummaryCardProps = {
    title: string,
    icon: ReactNode,
    tone: "danger" | "warning",
    count: number,
    items: { id: string, name: string, detail: string }[],
    href: string
}

const SummaryCard = ({ title, icon, tone, count, items, href }: SummaryCardProps) => (
    <Card withBorder padding="lg" className={`${tableStyles.card} ${styles.card} ${styles[tone]}`}>
        <Group justify="space-between" wrap="nowrap">
            <Text className={styles.cardTitle}>{title}</Text>
            <span className={styles.icon}>{icon}</span>
        </Group>
        <Text className={styles.count}>{count}</Text>
        {items.length === 0 ? (
            <Text c="dimmed" size="sm" className={styles.list}>All good</Text>
        ) : (
            <ul className={styles.list}>
                {items.slice(0, MAX_ITEMS).map((item) => (
                    <li key={item.id} className={styles.item}>
                        <span className={styles.itemName}>{item.name}</span> — {item.detail}
                    </li>
                ))}
            </ul>
        )}
        <Group justify="flex-end">
            <LinkButton href={href} variant="subtle" size="xs">View all</LinkButton>
        </Group>
    </Card>
);

const formatDate = (date: Date) => dayjs(date).format("DD.MM.YYYY");

export default async function Home() {
    const [session, { lowStock, expiringSoon, expired }] = await Promise.all([
        auth(),
        dashboardService.getSummary()
    ]);

    return (
        <>
            <Title order={2} mb="lg" className={`${headerStyles.header} ${headerStyles.title}`}>
                Welcome, {session?.user?.name}
            </Title>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                <SummaryCard
                    title="Low stock"
                    tone="danger"
                    icon={<IconAlertTriangle size={22} stroke={1.7} />}
                    count={lowStock.length}
                    items={lowStock.map((medicine) => ({
                        id: medicine.id,
                        name: medicine.name,
                        detail: `${medicine.stock}/${medicine.minStock} ${medicine.unit}`
                    }))}
                    href="/medicines"
                />
                <SummaryCard
                    title="Expiring soon"
                    tone="warning"
                    icon={<IconClock size={22} stroke={1.7} />}
                    count={expiringSoon.length}
                    items={expiringSoon.map((batch) => ({
                        id: batch.id,
                        name: `${batch.medicine} (${batch.batchNumber})`,
                        detail: formatDate(batch.expiryDate)
                    }))}
                    href="/stock?status=expiring"
                />
                <SummaryCard
                    title="Expired"
                    tone="danger"
                    icon={<IconAlertOctagon size={22} stroke={1.7} />}
                    count={expired.length}
                    items={expired.map((batch) => ({
                        id: batch.id,
                        name: `${batch.medicine} (${batch.batchNumber})`,
                        detail: formatDate(batch.expiryDate)
                    }))}
                    href="/stock?status=expired"
                />
            </SimpleGrid>
        </>
    )
}
