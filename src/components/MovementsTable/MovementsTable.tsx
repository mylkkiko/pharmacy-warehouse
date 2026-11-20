import { MovementType } from '@/server/repositories/types';
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
import { IconArrowsExchange } from '@tabler/icons-react';
import dayjs from 'dayjs';
import styles from '../MedicinesTable/MedicinesTable.module.css';
import localStyles from './MovementsTable.module.css';

type MovementRow = {
    id: string,
    date: Date,
    type: MovementType,
    medicine: string,
    batchNumber: string,
    quantity: number,
    unit: string,
    user: string,
    note: string | null
}

type MovementsTableProps = {
    rows: MovementRow[]
}

const TYPE_BADGE: Record<MovementType, { label: string, className: string }> = {
    RECEIPT: { label: 'Receipt', className: localStyles.receipt },
    ISSUE: { label: 'Issue', className: localStyles.issue },
    WRITE_OFF: { label: 'Write off', className: localStyles.writeOff },
};

const formatDateTime = (date: Date) => dayjs(date).format('DD.MM.YYYY HH:mm');

export const MovementsTable = ({ rows }: MovementsTableProps) => {
    if (rows.length === 0) {
        return (
            <Card className={`${styles.card} ${styles.empty}`}>
                <IconArrowsExchange size={32} stroke={1.4} className={styles.emptyIcon} />
                <Text c="dimmed">No movements yet</Text>
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
                            <TableTh>Date & time</TableTh>
                            <TableTh>Type</TableTh>
                            <TableTh>Medicine</TableTh>
                            <TableTh>Batch</TableTh>
                            <TableTh>Quantity</TableTh>
                            <TableTh>User</TableTh>
                            <TableTh>Note</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {rows.map(row => {
                            const badge = TYPE_BADGE[row.type];
                            const isIncoming = row.type === 'RECEIPT';

                            return (
                                <TableTr key={row.id}>
                                    <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>{formatDateTime(row.date)}</TableTd>
                                    <TableTd>
                                        <Badge radius="xl" className={`${localStyles.type} ${badge.className}`}>
                                            {badge.label}
                                        </Badge>
                                    </TableTd>
                                    <TableTd className={styles.name}>{row.medicine}</TableTd>
                                    <TableTd>
                                        <Badge radius="xl" className={styles.formBadge}>{row.batchNumber}</Badge>
                                    </TableTd>
                                    <TableTd className={`${localStyles.nowrap} ${isIncoming ? localStyles.incoming : localStyles.outgoing}`}>
                                        {isIncoming ? '+' : '−'}{row.quantity} {row.unit}
                                    </TableTd>
                                    <TableTd className={styles.muted}>{row.user}</TableTd>
                                    <TableTd className={styles.muted}>{row.note ?? '—'}</TableTd>
                                </TableTr>
                            );
                        })}
                    </TableTbody>
                </Table>
            </TableScrollContainer>
        </Card>
    );
}
