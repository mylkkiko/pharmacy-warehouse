"use client"

import { Button, ButtonProps } from "@mantine/core"
import Link from "next/link"
import styles from "./LinkButton.module.css"

type LinkButtonProps = {
    href: string;
    leftSection?: React.ReactNode;
    children: React.ReactNode;
    variant?: ButtonProps["variant"]
};

export const LinkButton = ({ href, leftSection, children, variant }: LinkButtonProps) => {
    return (
        <Button
            component={Link}
            href={href}
            leftSection={leftSection}
            variant={variant}
            radius="xl"
            className={variant ? undefined : styles.button}
        >
            {children}
        </Button>
    )
}
