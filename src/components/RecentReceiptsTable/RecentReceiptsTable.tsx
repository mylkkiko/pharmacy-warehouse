import { CURRENCY } from '@/lib/constants';
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
import { IconReceipt } from '@tabler/icons-react';
import dayjs from 'dayjs';
import styles from '../MedicinesTable/MedicinesTable.module.css';
import localStyles from './RecentReceiptsTable.module.css';

type ReceiptRow = {
    id: string,
    date: Date,
    medicine: string,
    batchNumber: string,
    expiryDate: Date,
    quantity: number,
    unit: string,
    unitPrice: number,
    total: number,
    receivedBy: string
}

type RecentReceiptsTableProps = {
    rows: ReceiptRow[]
}

const formatDate = (date: Date) => dayjs(date).format('DD.MM.YYYY');
const formatPrice = (value: number) => `${CURRENCY}${value.toFixed(2)}`;

export const RecentReceiptsTable = ({ rows }: RecentReceiptsTableProps) => {
    if (rows.length === 0) {
        return (
            <Card className={`${styles.card} ${styles.empty}`}>
                <IconReceipt size={32} stroke={1.4} className={styles.emptyIcon} />
                <Text c="dimmed">No receipts yet</Text>
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
                            <TableTh>Date</TableTh>
                            <TableTh>Medicine</TableTh>
                            <TableTh>Batch</TableTh>
                            <TableTh>Expiry</TableTh>
                            <TableTh>Quantity</TableTh>
                            <TableTh>Unit price</TableTh>
                            <TableTh>Total</TableTh>
                            <TableTh>Received by</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {rows.map(row => (
                            <TableTr key={row.id}>
                                <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>{formatDate(row.date)}</TableTd>
                                <TableTd className={styles.name}>{row.medicine}</TableTd>
                                <TableTd>
                                    <Badge radius="xl" className={styles.formBadge}>{row.batchNumber}</Badge>
                                </TableTd>
                                <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>{formatDate(row.expiryDate)}</TableTd>
                                <TableTd className={localStyles.nowrap}>{row.quantity} {row.unit}</TableTd>
                                <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>{formatPrice(row.unitPrice)}</TableTd>
                                <TableTd className={`${styles.name} ${localStyles.nowrap}`}>{formatPrice(row.total)}</TableTd>
                                <TableTd className={styles.muted}>{row.receivedBy}</TableTd>
                            </TableTr>
                        ))}
                    </TableTbody>
                </Table>
            </TableScrollContainer>
        </Card>
    );
}
