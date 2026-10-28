"use client"

import { ActionIcon, Badge, Card, Group, Table, Text, Tooltip } from '@mantine/core';
import { IconAlertTriangle, IconPencil, IconPill } from '@tabler/icons-react';
import Link from 'next/link';
import styles from './MedicinesTable.module.css';

type MedicineRow = {
    id: string,
    name: string,
    activeIngredient: string,
    form: string,
    dosage: string,
    stock: number,
    unit: string,
    minStock: number
}

type MedicineTableProps = {
    medicines: MedicineRow[]
}

export const MedicinesTable = ({ medicines }: MedicineTableProps) => {
    if (medicines.length === 0) {
        return (
            <Card className={`${styles.card} ${styles.empty}`}>
                <IconPill size={32} stroke={1.4} className={styles.emptyIcon} />
                <Text className={styles.emptyText}>No medicines found</Text>
            </Card>
        );
    }

    const rows = medicines.map(med => {
        const isLow = med.stock < med.minStock;

        return (
            <Table.Tr key={med.id}>
                <Table.Td className={styles.name}>{med.name}</Table.Td>
                <Table.Td className={styles.muted}>{med.activeIngredient}</Table.Td>
                <Table.Td>
                    <Badge radius="xl" className={styles.formBadge}>{med.form}</Badge>
                </Table.Td>
                <Table.Td className={styles.muted}>{med.dosage}</Table.Td>
                <Table.Td>
                    {isLow ? (
                        <Badge
                            radius="xl"
                            leftSection={<IconAlertTriangle size={12} stroke={2} />}
                            className={styles.lowStock}
                        >
                            {med.stock} {med.unit}
                        </Badge>
                    ) : (
                        <Group gap={8} wrap="nowrap" className={styles.okStock}>
                            <span className={styles.okDot} />
                            {med.stock} {med.unit}
                        </Group>
                    )}
                </Table.Td>
                <Table.Td className={styles.muted}>{med.minStock}</Table.Td>
                <Table.Td>
                    <Tooltip label="Edit" withArrow openDelay={300}>
                        <ActionIcon
                            component={Link}
                            href={`/medicines/${med.id}/edit`}
                            variant="subtle"
                            radius="md"
                            aria-label={`Edit ${med.name}`}
                            className={styles.editButton}
                        >
                            <IconPencil size={16} stroke={1.7} />
                        </ActionIcon>
                    </Tooltip>
                </Table.Td>
            </Table.Tr>
        );
    })

    return (
        <Card padding={0} className={styles.card}>
            <Table.ScrollContainer minWidth={760}>
                <Table
                    withRowBorders={false}
                    verticalSpacing="sm"
                    horizontalSpacing="md"
                    classNames={{
                        table: styles.table,
                        thead: styles.thead,
                        th: styles.th,
                        tr: styles.tr,
                        td: styles.td
                    }}
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Active ingredient</Table.Th>
                            <Table.Th>Form</Table.Th>
                            <Table.Th>Dosage</Table.Th>
                            <Table.Th>Stock</Table.Th>
                            <Table.Th>Min stock</Table.Th>
                            <Table.Th className={styles.actionsTh} aria-label="Actions" />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Card>
    );
}
