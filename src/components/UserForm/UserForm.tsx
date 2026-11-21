"use client"

import { USER_ROLES, UpdateUserInput, createUserSchema, updateUserSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, PasswordInput, Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormCard } from "@/components/FormCard/FormCard";
import { HALF_WIDTH, inputClassNames, selectClassNames } from "@/components/FormCard/formClassNames";

type UserFormValues = UpdateUserInput;

type UserFormProps = {
    action: (data: UserFormValues) => Promise<{ error: string } | undefined>,
    mode: "create" | "edit",
    defaultValues?: UserFormValues,
    title: string,
    description: string,
    submitLabel: string
}

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
        <FormCard
            title={title}
            description={description}
            backHref="/admin/users"
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
                <Grid.Col span={HALF_WIDTH}>
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
                <Grid.Col span={HALF_WIDTH}>
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
        </FormCard>
    )
}
