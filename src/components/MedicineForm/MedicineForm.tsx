"use client"

import { MEDICINE_FORMS, MEDICINE_UNITS, MedicineInput, medicineSchema } from "@/lib/validations/medicine";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, Select, NumberInput, Grid } from "@mantine/core";
import { useState } from "react";
import { FormCard } from "@/components/FormCard/FormCard";
import { HALF_WIDTH, inputClassNames, numberClassNames, selectClassNames } from "@/components/FormCard/formClassNames";

type MedicineFormProps = {
    action: (data: MedicineInput) => Promise<{ error: string } | undefined>,
    defaultValues?: MedicineInput,
    title: string,
    description: string,
    submitLabel: string
}

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
        <FormCard
            title={title}
            description={description}
            backHref="/medicines"
            error={error}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={submitLabel}
            submitting={isSubmitting}
        >
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
                <Grid.Col span={HALF_WIDTH}>
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
                <Grid.Col span={HALF_WIDTH}>
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
                <Grid.Col span={HALF_WIDTH}>
                    <TextInput
                        label="Dosage"
                        withAsterisk
                        placeholder="200 mg"
                        error={errors.dosage?.message}
                        classNames={inputClassNames}
                        {...register("dosage")}
                    />
                </Grid.Col>
                <Grid.Col span={HALF_WIDTH}>
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
                                classNames={numberClassNames}
                            />
                        )}
                    />
                </Grid.Col>
            </Grid>
        </FormCard>
    )
}
