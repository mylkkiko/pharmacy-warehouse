"use client"

import { issueMedicine } from "@/lib/actions/issueMedicine"
import { IssueInput, issueSchema } from "@/lib/validations/issue"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, Button, CloseButton, Grid, Group, NumberInput, Select, Stack, TextInput, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import styles from "../MedicineForm/MedicineForm.module.css"

type MedicineOption = {
    value: string,
    label: string,
    unit: string,
}

type IssueFormProps = {
    medicineOptions: MedicineOption[]
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

const numberClassNames = {
    ...inputClassNames,
    controls: styles.controls,
    control: styles.control
};

export const IssueForm = ({ medicineOptions }: IssueFormProps) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<IssueInput>({
        defaultValues: {
            medicineId: "",
            note: ""
        },
        resolver: zodResolver(issueSchema)
    })

    const medicineId = useWatch({ control, name: "medicineId" });
    const unit = medicineOptions.find((option) => option.value === medicineId)?.unit;

    const onSubmit = async (data: IssueInput) => {
        setError(null);
        const result = await issueMedicine(data);
        if (result.error) {
            setError(result.error);
            return;
        }
        notifications.show({ message: "Medicine issued", color: "green" });
        router.push("/issue");
    }

    return (
        <div className={styles.card}>
            <Group justify="space-between" align="flex-start" wrap="nowrap" className={styles.header}>
                <Title order={3} className={styles.title}>New issue</Title>
                <CloseButton
                    component={Link}
                    href="/issue"
                    aria-label="Close"
                    radius="md"
                    className={styles.close}
                />
            </Group>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack gap="lg">
                    {error && <Alert color="red" variant="light">{error}</Alert>}
                    <Grid gap="md">
                        <Grid.Col span={12}>
                            <Controller
                                control={control}
                                name="medicineId"
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Medicine"
                                        withAsterisk
                                        {...field}
                                        onChange={(value) => field.onChange(value ?? "")}
                                        error={fieldState.error?.message}
                                        placeholder="Pick medicine"
                                        data={medicineOptions}
                                        searchable
                                        classNames={selectClassNames}
                                    />
                                )}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                control={control}
                                name="quantity"
                                render={({ field, fieldState }) => (
                                    <NumberInput
                                        {...field}
                                        value={field.value ?? ""}
                                        min={1}
                                        allowDecimal={false}
                                        withAsterisk
                                        error={fieldState.error?.message}
                                        label="Quantity"
                                        placeholder="10"
                                        rightSection={unit}
                                        classNames={numberClassNames}
                                    />
                                )}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Issued to"
                                withAsterisk
                                placeholder="e.g. Surgery"
                                error={errors.note?.message}
                                classNames={inputClassNames}
                                {...register("note")}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="flex-end" gap="sm" className={styles.actions}>
                        <Button
                            component={Link}
                            href="/issue"
                            variant="default"
                            radius="md"
                            className={styles.cancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            radius="md"
                            loading={isSubmitting}
                            loaderProps={{ type: 'dots' }}
                            leftSection={<IconCheck size={18} stroke={2} />}
                            className={styles.submit}
                        >
                            Issue medicine
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}
