"use client"

import { TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import styles from './SearchInput.module.css';

export const SearchInput = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if(term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <>
            <TextInput
                defaultValue={searchParams.get("q")?.toString()}
                leftSection={<IconSearch size={16} />}
                onChange={(e) => {handleSearch(e.currentTarget.value)}}
                placeholder="Search medicines..."
                aria-label="Search medicines"
                classNames={{
                    root: styles.root,
                    wrapper: styles.wrapper,
                    input: styles.input,
                    section: styles.section
                }}
            />
        </>
    );
}