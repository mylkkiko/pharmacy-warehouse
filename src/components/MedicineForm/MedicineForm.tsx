"use client"

import { MEDICINE_FORMS, MEDICINE_UNITS, MedicineInput, medicineSchema } from "@/lib/validations/medicine";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Stack, TextInput, Select, NumberInput, Button, Grid, Group, Text, Title, CloseButton } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";
import styles from "./MedicineForm.module.css";

type MedicineFormProps = {
    action: (data: MedicineInput) => Promise<{ error: string } | undefined>,
    defaultValues?: MedicineInput,
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

export const MedicineForm = ({ action, defaultValues, title, description, submitLabel }: MedicineFormProps) => {
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control
    } = useForm<MedicineInput>({
        defaultValues: defaultValues ??
        {
            name: "",
            activeIngredient: "",
            form: "",
            dosage: "",
            unit: "",
            minStock: 0
        },
        resolver: zodResolver(medicineSchema)
    });

    const onSubmit = async (data: MedicineInput) => {
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
                    href="/medicines"
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
                                placeholder="Paracetamol"
                                error={errors.name?.message}
                                classNames={inputClassNames}
                                {...register("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Active ingredient"
                                withAsterisk
                                placeholder="Paracetamol"
                                error={errors.activeIngredient?.message}
                                classNames={inputClassNames}
                                {...register("activeIngredient")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                control={control}
                                name="form"
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Form"
                                        withAsterisk
                                        {...field}
                                        error={fieldState.error?.message}
                                        placeholder="Pick form"
                                        data={MEDICINE_FORMS}
                                        classNames={selectClassNames}
                                    />
                                )}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                control={control}
                                name="unit"
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Unit"
                                        withAsterisk
                                        {...field}
                                        error={fieldState.error?.message}
                                        placeholder="Pick unit"
                                        data={MEDICINE_UNITS}
                                        classNames={selectClassNames}
                                    />
                                )}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Dosage"
                                withAsterisk
                                placeholder="200 mg"
                                error={errors.dosage?.message}
                                classNames={inputClassNames}
                                {...register("dosage")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                control={control}
                                name="minStock"
                                render={({ field, fieldState }) => (
                                    <NumberInput
                                        {...field}
                                        min={0}
                                        withAsterisk
                                        error={fieldState.error?.message}
                                        label="Min stock"
                                        placeholder="15"
                                        classNames={{ ...inputClassNames, controls: styles.controls, control: styles.control }}
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
