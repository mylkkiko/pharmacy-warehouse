import { LinkButton } from "@/components/LinkButton/LinkButton";
import { UsersTable } from "@/components/UsersTable/UsersTable";
import { auth } from "@/lib/auth";
import { userService } from "@/server/container";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import styles from "../../medicines/page.module.css";

export default async function UsersPage() {
    const [session, users] = await Promise.all([auth(), userService.list()]);

    const count = `${users.length} ${users.length === 1 ? "user" : "users"}`;

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={styles.header}>
                <Stack gap={4}>
                    <Title order={2} className={styles.title}>Users</Title>
                    <Text size="sm" className={styles.subtitle}>
                        Total: <span className={styles.count}>{count}</span>
                    </Text>
                </Stack>
                <LinkButton href="/admin/users/new" leftSection={<IconPlus size={18} stroke={2} />}>
                    Add user
                </LinkButton>
            </Group>

            <UsersTable users={users} currentUserId={session?.user?.id ?? ""} />
        </>
    )
}
