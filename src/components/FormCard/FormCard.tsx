"use client"

import { Alert, Button, CloseButton, Group, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { FormEventHandler, ReactNode } from "react";
import styles from "./FormCard.module.css";

type FormCardProps = {
    title: string,
    description: string,
    /** List page the close button and Cancel link back to */
    backHref: string,
    error: string | null,
    onSubmit: FormEventHandler<HTMLFormElement>,
    submitLabel: string,
    submitting: boolean,
    children: ReactNode
}

export const FormCard = ({ title, description, backHref, error, onSubmit, submitLabel, submitting, children }: FormCardProps) => {
    return (
        <div className={styles.card}>
            <Group justify="space-between" align="flex-start" wrap="nowrap" className={styles.header}>
                <Stack gap={4}>
                    <Title order={3} className={styles.title}>{title}</Title>
                    <Text size="sm" className={styles.description}>{description}</Text>
                </Stack>
                <CloseButton
                    component={Link}
                    href={backHref}
                    aria-label="Close"
                    radius="md"
                    className={styles.close}
                />
            </Group>

            <form onSubmit={onSubmit} noValidate>
                <Stack gap="lg">
                    {error && <Alert color="red" variant="light">{error}</Alert>}

                    {children}

                    <Group justify="flex-end" gap="sm" className={styles.actions}>
                        <Button
                            component={Link}
                            href={backHref}
                            variant="subtle"
                            radius="md"
                            className={styles.cancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            radius="md"
                            loading={submitting}
                            loaderProps={{ type: 'dots' }}
                            leftSection={<IconCheck size={18} stroke={2} />}
                            className={styles.submit}
                        >
                            {submitLabel}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    );
}
