"use client"

import { SegmentedControl } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '../StockFilter/StockFilter.module.css';

const DEFAULT_PERIOD = 'month';

const OPTIONS = [
    { label: 'This month', value: 'month' },
    { label: 'Last month', value: 'last-month' },
    { label: 'All time', value: 'all' },
];

export const FinancePeriodFilter = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const value = searchParams.get('period') ?? DEFAULT_PERIOD;

    const handleChange = (next: string) => {
        const params = new URLSearchParams(searchParams);
        if (next === DEFAULT_PERIOD) {
            params.delete('period');
        } else {
            params.set('period', next);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <SegmentedControl
            value={value}
            onChange={handleChange}
            data={OPTIONS}
            radius="xl"
            aria-label="Filter by period"
            classNames={{
                root: styles.root,
                indicator: styles.indicator,
                label: styles.label
            }}
        />
    );
}
