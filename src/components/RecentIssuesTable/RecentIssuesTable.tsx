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
import { IconTruckDelivery } from '@tabler/icons-react';
import dayjs from 'dayjs';
import styles from '../MedicinesTable/MedicinesTable.module.css';
import localStyles from '../RecentReceiptsTable/RecentReceiptsTable.module.css';

type IssueRow = {
    id: string,
    date: Date,
    medicine: string,
    batchNumber: string,
    quantity: number,
    unit: string,
    note: string | null,
    issuedBy: string
}

type RecentIssuesTableProps = {
    rows: IssueRow[]
}

const formatDate = (date: Date) => dayjs(date).format('DD.MM.YYYY');

export const RecentIssuesTable = ({ rows }: RecentIssuesTableProps) => {
    if (rows.length === 0) {
        return (
            <Card className={`${styles.card} ${styles.empty}`}>
                <IconTruckDelivery size={32} stroke={1.4} className={styles.emptyIcon} />
                <Text c="dimmed">No issues yet</Text>
            </Card>
        );
    }

    return (
        <Card padding={0} className={styles.card}>
            <TableScrollContainer minWidth={760}>
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
                            <TableTh>Quantity</TableTh>
                            <TableTh>Issued to</TableTh>
                            <TableTh>Issued by</TableTh>
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
                                <TableTd className={localStyles.nowrap}>{row.quantity} {row.unit}</TableTd>
                                <TableTd>{row.note ?? '—'}</TableTd>
                                <TableTd className={styles.muted}>{row.issuedBy}</TableTd>
                            </TableTr>
                        ))}
                    </TableTbody>
                </Table>
            </TableScrollContainer>
        </Card>
    );
}
