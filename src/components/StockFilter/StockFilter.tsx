"use client"

import { SegmentedControl } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './StockFilter.module.css';

const OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Expired', value: 'expired' },
    { label: 'Expiring soon', value: 'expiring' },
    { label: 'OK', value: 'ok' },
];

export const StockFilter = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const value = searchParams.get('status') ?? 'all';

    const handleChange = (next: string) => {
        const params = new URLSearchParams(searchParams);
        if (next === 'all') {
            params.delete('status');
        } else {
            params.set('status', next);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <SegmentedControl
            value={value}
            onChange={handleChange}
            data={OPTIONS}
            radius="xl"
            aria-label="Filter by status"
            classNames={{
                root: styles.root,
                indicator: styles.indicator,
                label: styles.label
            }}
        />
    );
}
