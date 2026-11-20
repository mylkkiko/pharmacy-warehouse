import { LinkButton } from "@/components/LinkButton/LinkButton"
import { RecentIssuesTable } from "@/components/RecentIssuesTable/RecentIssuesTable"
import { issueService } from "@/server/container"
import { Group, Stack, Text, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import styles from "../medicines/page.module.css"

export default async function Issue() {
    const [rows, totalCount] = await Promise.all([
        issueService.listRecent(20),
        issueService.count()
    ]);

    const count = `${totalCount} ${totalCount === 1 ? "issue" : "issues"}`;

    return (
        <>
            <Group justify="space-between" align="flex-end" mb="lg" gap="md" className={styles.header}>
                <Stack gap={4}>
                    <Title order={2} className={styles.title}>Issues</Title>
                    <Text size="sm" className={styles.subtitle}>
                        Total: <span className={styles.count}>{count}</span>
                    </Text>
                </Stack>
                <LinkButton href="/issue/new" leftSection={<IconPlus size={18} stroke={2} />}>
                    New issue
                </LinkButton>
            </Group>

            <RecentIssuesTable rows={rows} />
        </>
    )
}
