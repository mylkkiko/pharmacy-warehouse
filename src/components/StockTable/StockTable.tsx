import { BatchStatus } from '@/lib/stock';
import {
    Badge,
    Card,
    Table,
    TableScrollContainer,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text
} from '@mantine/core';
import { IconPackage } from '@tabler/icons-react';
import dayjs from 'dayjs';
import styles from '../MedicinesTable/MedicinesTable.module.css';
import localStyles from './StockTable.module.css';

type StockRow = {
    id: string,
    medicine: string,
    dosage: string,
    batchNumber: string,
    supplier: string | null,
    receivedAt: Date,
    expiryDate: Date,
    quantity: number,
    unit: string,
    status: BatchStatus
}

type StockTableProps = {
    rows: StockRow[]
}

const STATUS_BADGE: Record<BatchStatus, { label: string, className: string }> = {
    EXPIRED: { label: 'Expired', className: localStyles.expired },
    EXPIRING: { label: 'Expiring soon', className: localStyles.expiring },
    OK: { label: 'OK', className: localStyles.ok },
};

const formatDate = (date: Date) => dayjs(date).format('DD.MM.YYYY');

export const StockTable = ({ rows }: StockTableProps) => {
    if (rows.length === 0) {
        return (
            <Card className={`${styles.card} ${styles.empty}`}>
                <IconPackage size={32} stroke={1.4} className={styles.emptyIcon} />
                <Text c="dimmed">No batches found</Text>
            </Card>
        );
    }

    return (
        <Card padding={0} className={styles.card}>
            <TableScrollContainer minWidth={860}>
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
                    <TableThead>
                        <TableTr>
                            <TableTh>Medicine</TableTh>
                            <TableTh>Batch</TableTh>
                            <TableTh>Supplier</TableTh>
                            <TableTh>Received</TableTh>
                            <TableTh>Expiry</TableTh>
                            <TableTh>Quantity</TableTh>
                            <TableTh>Status</TableTh>
                            <TableTh className={styles.actionsTh} aria-label="Actions" />
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {rows.map(row => {
                            const badge = STATUS_BADGE[row.status];

                            return (
                                <TableTr key={row.id}>
                                    <TableTd>
                                        <div className={styles.name}>{row.medicine}</div>
                                        <Text size="xs" c="dimmed" className={localStyles.dosage}>{row.dosage}</Text>
                                    </TableTd>
                                    <TableTd>
                                        <Badge radius="xl" className={styles.formBadge}>{row.batchNumber}</Badge>
                                    </TableTd>
                                    <TableTd className={styles.muted}>{row.supplier ?? '—'}</TableTd>
                                    <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>{formatDate(row.receivedAt)}</TableTd>
                                    <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>{formatDate(row.expiryDate)}</TableTd>
                                    <TableTd className={localStyles.nowrap}>{row.quantity} {row.unit}</TableTd>
                                    <TableTd>
                                        <Badge radius="xl" className={`${localStyles.status} ${badge.className}`}>
                                            {badge.label}
                                        </Badge>
                                    </TableTd>
                                    <TableTd />
                                </TableTr>
                            );
                        })}
                    </TableTbody>
                </Table>
            </TableScrollContainer>
        </Card>
    );
}
