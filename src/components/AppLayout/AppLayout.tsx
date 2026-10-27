"use client"

import { AppShell, Avatar, Badge, Burger, Group, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Session } from 'next-auth';
import { logOut } from '@/lib/actions/auth';
import Sidebar, { type SidebarLink } from '@/components/Sidebar/Sidebar';
import styles from './AppLayout.module.css';

import {
    IconBuildingWarehouse,
    IconTruckDelivery,
    IconUsers,
    IconLayoutDashboard,
    IconPill,
    IconPackageExport,
    IconHistory,
    IconLogout
} from '@tabler/icons-react';

const links: SidebarLink[] = [
    { label: "Dashboard", href: "/", icon: IconLayoutDashboard },
    { label: "Medicines", href: "/medicines", icon: IconPill },
    { label: "Receipts", href: "/receipts", icon: IconTruckDelivery },
    { label: "Stock", href: "/stock", icon: IconBuildingWarehouse },
    { label: "Issue", href: "/issue", icon: IconPackageExport },
    { label: "Movements", href: "/movements", icon: IconHistory },
    { label: "Users", href: "/admin/users", icon: IconUsers, adminOnly: true }
]

type AppLayoutProps = {
    user: Session["user"],
    children: React.ReactNode
}

export default function AppLayout({ user, children }: AppLayoutProps) {
    const [opened, { toggle, close }] = useDisclosure();

    const visibleLinks = links.filter(link => !link.adminOnly || user.role === "ADMIN");

    return (
        <AppShell
            padding="lg"
            header={{ height: 64 }}
            navbar={{
                width: 240,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            classNames={{
                root: styles.shell,
                header: styles.header,
                navbar: styles.navbar,
                main: styles.main
            }}
        >
            <AppShell.Header>
                <Group justify="space-between" h="100%" px="md">
                    <Group gap="sm">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            className={styles.burger}
                        />
                        <div className={styles.logo}>
                            <IconPill size={18} stroke={1.8} />
                        </div>
                        <Text className={styles.brand}>
                            Pharmacy <span className={styles.brandMuted}>Warehouse</span>
                        </Text>
                    </Group>

                    <Group gap="sm" wrap="nowrap">
                        <Group gap={10} wrap="nowrap" className={styles.user}>
                            <Avatar name={user.name ?? undefined} size={32} radius="xl" className={styles.avatar} />
                            <Text size="sm" visibleFrom="sm" className={styles.userName}>{user.name}</Text>
                            <Badge radius="xl" className={styles.roleBadge}>{user.role}</Badge>
                        </Group>
                        <UnstyledButton onClick={() => logOut()} className={styles.signOut} aria-label="Sign out">
                            <IconLogout size={18} stroke={1.7} />
                            <Text span size="sm" visibleFrom="sm">Sign out</Text>
                        </UnstyledButton>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Sidebar links={visibleLinks} onNavigate={close} />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
