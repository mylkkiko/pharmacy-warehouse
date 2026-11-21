"use client"

import { createReceipt } from "@/lib/actions/createReceipt"
import { CURRENCY } from "@/lib/constants"
import { ReceiptInput, receiptSchema } from "@/lib/validations/receipt"
import { zodResolver } from "@hookform/resolvers/zod"
import { Grid, NumberInput, Select, Text, TextInput } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { notifications } from "@mantine/notifications"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { FormCard } from "@/components/FormCard/FormCard"
import styles from "@/components/FormCard/FormCard.module.css"
import { HALF_WIDTH, datePopoverProps, inputClassNames, numberClassNames, selectClassNames } from "@/components/FormCard/formClassNames"

type MedicineOption = {
    value: string,
    label: string,
    unit: string,
}

type ReceiptFormProps = {
    medicineOptions: MedicineOption[]
}

export const ReceiptForm = ({ medicineOptions }: ReceiptFormProps) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<ReceiptInput>({
        defaultValues: {
            medicineId: "",
            batchNumber: "",
            supplier: ""
        },
        resolver: zodResolver(receiptSchema)
    })

    const medicineId = useWatch({ control, name: "medicineId" });
    const quantity = useWatch({ control, name: "quantity" });
    const unitPrice = useWatch({ control, name: "unitPrice" });

    const unit = medicineOptions.find((option) => option.value === medicineId)?.unit;
    const showTotal = typeof quantity === "number" && quantity > 0
        && typeof unitPrice === "number" && unitPrice > 0;

    const onSubmit = async (data: ReceiptInput) => {
        setError(null);
        const result = await createReceipt(data);
        if (result.error) {
            setError(result.error);
            return;
        }
        notifications.show({ message: "Batch received", color: "green" });
        router.push('/receipts');
    }

    return (
        <FormCard
            title="New receipt"
            description="Register a new batch arriving at the warehouse"
            backHref="/receipts"
            error={error}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel="Receive batch"
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
                    <TextInput
                        label="Batch number"
                        withAsterisk
                        placeholder="AB12345"
                        error={errors.batchNumber?.message}
                        classNames={inputClassNames}
                        {...register("batchNumber")}
                    />
                </Grid.Col>
                <Grid.Col span={HALF_WIDTH}>
                    <Controller
                        control={control}
                        name="expiryDate"
                        render={({ field, fieldState }) => (
                            <DatePickerInput
                                label="Expiry date"
                                withAsterisk
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? null}
                                onChange={(value) => field.onChange(value ? new Date(value) : null)}
                                minDate={new Date()}
                                error={fieldState.error?.message}
                                placeholder="Pick date"
                                classNames={inputClassNames}
                                popoverProps={datePopoverProps}
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
                                placeholder="100"
                                rightSection={unit}
                                classNames={numberClassNames}
                            />
                        )}
                    />
                </Grid.Col>
                <Grid.Col span={HALF_WIDTH}>
                    <Controller
                        control={control}
                        name="unitPrice"
                        render={({ field, fieldState }) => (
                            <NumberInput
                                {...field}
                                value={field.value ?? ""}
                                min={0}
                                decimalScale={2}
                                prefix={`${CURRENCY} `}
                                withAsterisk
                                error={fieldState.error?.message}
                                label="Unit price"
                                placeholder={`${CURRENCY} 0.00`}
                                classNames={numberClassNames}
                            />
                        )}
                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput
                        label="Supplier"
                        placeholder="Supplier name"
                        error={errors.supplier?.message}
                        classNames={inputClassNames}
                        {...register("supplier")}
                    />
                </Grid.Col>
            </Grid>

            {showTotal && (
                <Text fw={600} ta="right" className={styles.title}>
                    Total: {CURRENCY} {(quantity * unitPrice).toFixed(2)}
                </Text>
            )}
        </FormCard>
    )
}
