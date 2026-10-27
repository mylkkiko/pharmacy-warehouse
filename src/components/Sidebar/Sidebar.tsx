"use client"

import { NavLink, Stack } from '@mantine/core';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Icon } from '@tabler/icons-react';
import styles from './Sidebar.module.css';

export type SidebarLink = {
    label: string,
    href: string,
    icon: Icon,
    adminOnly?: boolean
}

type SidebarProps = {
    links: SidebarLink[],
    onNavigate: () => void
}

const isActive = (pathname: string, href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

export default function Sidebar({ links, onNavigate }: SidebarProps) {
    const pathname = usePathname();

    return (
        <Stack gap={4} className={styles.sidebar}>
            {links.map(link => (
                <NavLink key={link.href}
                    label={link.label}
                    href={link.href}
                    leftSection={<link.icon size={20} stroke={1.6} />}
                    component={Link}
                    active={isActive(pathname, link.href)}
                    onClick={onNavigate}
                    classNames={{
                        root: styles.link,
                        section: styles.icon,
                        label: styles.label
                    }}
                />
            ))}
        </Stack>
    );
}
