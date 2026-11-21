"use client"

import { issueMedicine } from "@/lib/actions/issueMedicine"
import { IssueInput, issueSchema } from "@/lib/validations/issue"
import { zodResolver } from "@hookform/resolvers/zod"
import { Grid, NumberInput, Select, TextInput } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { FormCard } from "@/components/FormCard/FormCard"
import { HALF_WIDTH, inputClassNames, numberClassNames, selectClassNames } from "@/components/FormCard/formClassNames"

type MedicineOption = {
    value: string,
    label: string,
    unit: string,
}

type IssueFormProps = {
    medicineOptions: MedicineOption[]
}

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
        <FormCard
            title="New issue"
            description="Issue medicine to a department (FEFO: earliest expiry first)"
            backHref="/issue"
            error={error}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel="Issue medicine"
            submitting={isSubmitting}
        >
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
                <Grid.Col span={HALF_WIDTH}>
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
                <Grid.Col span={HALF_WIDTH}>
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
        </FormCard>
    )
}
