"use client"

import { Button, ButtonProps } from "@mantine/core"
import Link from "next/link"
import styles from "./LinkButton.module.css"

type LinkButtonProps = {
    href: string;
    leftSection?: React.ReactNode;
    children: React.ReactNode;
    variant?: ButtonProps["variant"],
    size?: ButtonProps["size"]
};

export const LinkButton = ({ href, leftSection, children, variant, size }: LinkButtonProps) => {
    return (
        <Button
            component={Link}
            href={href}
            leftSection={leftSection}
            variant={variant}
            size={size}
            radius="xl"
            className={variant ? undefined : styles.button}
        >
            {children}
        </Button>
    )
}
