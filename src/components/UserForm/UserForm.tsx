"use client"

import { USER_ROLES, UpdateUserInput, createUserSchema, updateUserSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, CloseButton, Grid, Group, PasswordInput, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "../MedicineForm/MedicineForm.module.css";

type UserFormValues = UpdateUserInput;

type UserFormProps = {
    action: (data: UserFormValues) => Promise<{ error: string } | undefined>,
    mode: "create" | "edit",
    defaultValues?: UserFormValues,
    title: string,
    description?: string,
    submitLabel: string
}

const inputClassNames = {
    label: styles.label,
    required: styles.required,
    input: styles.input,
    section: styles.section,
    error: styles.error
};

const selectClassNames = {
    ...inputClassNames,
    dropdown: styles.dropdown,
    option: styles.option
};

export const UserForm = ({ action, mode, defaultValues, title, description, submitLabel }: UserFormProps) => {
    const [error, setError] = useState<string | null>(null);
    const isEdit = mode === "edit";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control
    } = useForm<UserFormValues>({
        defaultValues: defaultValues ?? {
            name: "",
            email: "",
            password: "",
            role: "PHARMACIST"
        },
        resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema)
    });

    const onSubmit = async (data: UserFormValues) => {
        setError(null);
        const result = await action(data);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className={styles.card}>
            <Group justify="space-between" align="flex-start" wrap="nowrap" className={styles.header}>
                <Stack gap={4}>
                    <Title order={3} className={styles.title}>{title}</Title>
                    {description && <Text size="sm" className={styles.description}>{description}</Text>}
                </Stack>
                <CloseButton
                    component={Link}
                    href="/admin/users"
                    aria-label="Close"
                    radius="md"
                    className={styles.close}
                />
            </Group>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack gap="lg">
                    {error && <Alert color="red" variant="light" className={styles.alert}>{error}</Alert>}
                    <Grid gap="md">
                        <Grid.Col span={12}>
                            <TextInput
                                label="Name"
                                withAsterisk
                                placeholder="Jane Doe"
                                error={errors.name?.message}
                                classNames={inputClassNames}
                                {...register("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Email"
                                type="email"
                                withAsterisk
                                placeholder="jane@example.com"
                                autoComplete="off"
                                error={errors.email?.message}
                                classNames={inputClassNames}
                                {...register("email")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <PasswordInput
                                label="Password"
                                withAsterisk={!isEdit}
                                placeholder={isEdit ? "New password" : "At least 8 characters"}
                                description={isEdit ? "Leave empty to keep current password" : undefined}
                                autoComplete="new-password"
                                error={errors.password?.message}
                                classNames={inputClassNames}
                                {...register("password")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                control={control}
                                name="role"
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Role"
                                        withAsterisk
                                        {...field}
                                        error={fieldState.error?.message}
                                        placeholder="Pick role"
                                        data={USER_ROLES}
                                        allowDeselect={false}
                                        classNames={selectClassNames}
                                    />
                                )}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="flex-end" gap="sm" className={styles.actions}>
                        <Button
                            type="submit"
                            radius="md"
                            loading={isSubmitting}
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
    )
}
