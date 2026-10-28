"use client"

import { Button } from "@mantine/core"
import Link from "next/link"
import styles from "./LinkButton.module.css"

type LinkButtonProps = {
    href: string;
    leftSection?: React.ReactNode;
    children: React.ReactNode;
};

export const LinkButton = ({ href, leftSection, children }: LinkButtonProps) => {
    return (
        <Button component={Link} href={href} leftSection={leftSection} radius="xl" className={styles.button}>
            {children}
        </Button>
    )
}
