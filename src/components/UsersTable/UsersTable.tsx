import { DeactivateUserButton } from '@/components/DeactivateUserButton/DeactivateUserButton';
import { LinkButton } from '@/components/LinkButton/LinkButton';
import {
    Badge,
    Card,
    Group,
    Table,
    TableScrollContainer,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text
} from '@mantine/core';
import { IconPencil, IconUsers } from '@tabler/icons-react';
import dayjs from 'dayjs';
import styles from '../MedicinesTable/MedicinesTable.module.css';
import localStyles from './UsersTable.module.css';

type UserRow = {
    id: string,
    name: string,
    email: string,
    role: "ADMIN" | "PHARMACIST",
    isActive: boolean,
    createdAt: Date
}

type UsersTableProps = {
    users: UserRow[],
    currentUserId: string
}

const ROLE_BADGE = {
    ADMIN: { label: 'Admin', className: localStyles.admin },
    PHARMACIST: { label: 'Pharmacist', className: localStyles.pharmacist },
};

export const UsersTable = ({ users, currentUserId }: UsersTableProps) => {
    if (users.length === 0) {
        return (
            <Card className={`${styles.card} ${styles.empty}`}>
                <IconUsers size={32} stroke={1.4} className={styles.emptyIcon} />
                <Text c="dimmed">No users yet</Text>
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
                            <TableTh>Name</TableTh>
                            <TableTh>Email</TableTh>
                            <TableTh>Role</TableTh>
                            <TableTh>Status</TableTh>
                            <TableTh>Created</TableTh>
                            <TableTh className={localStyles.actionsTh} aria-label="Actions" />
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {users.map(user => {
                            const role = ROLE_BADGE[user.role];

                            return (
                                <TableTr key={user.id}>
                                    <TableTd className={styles.name}>{user.name}</TableTd>
                                    <TableTd className={styles.muted}>{user.email}</TableTd>
                                    <TableTd>
                                        <Badge radius="xl" className={`${localStyles.badge} ${role.className}`}>{role.label}</Badge>
                                    </TableTd>
                                    <TableTd>
                                        <Badge radius="xl" className={`${localStyles.badge} ${user.isActive ? localStyles.active : localStyles.inactive}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableTd>
                                    <TableTd className={`${styles.muted} ${localStyles.nowrap}`}>
                                        {dayjs(user.createdAt).format('DD.MM.YYYY')}
                                    </TableTd>
                                    <TableTd>
                                        <Group gap={4} justify="flex-end" wrap="nowrap">
                                            <LinkButton
                                                href={`/admin/users/${user.id}/edit`}
                                                variant="subtle"
                                                size="xs"
                                                leftSection={<IconPencil size={16} />}
                                            >
                                                Edit
                                            </LinkButton>
                                            {user.id !== currentUserId && (
                                                <DeactivateUserButton userId={user.id} name={user.name} isActive={user.isActive} />
                                            )}
                                        </Group>
                                    </TableTd>
                                </TableTr>
                            );
                        })}
                    </TableTbody>
                </Table>
            </TableScrollContainer>
        </Card>
    );
}
