"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/validations/auth";
import { auth } from "@/lib/actions/auth";
import { Alert, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import styles from "./LoginForm.module.css";

const inputClassNames = {
    label: styles.label,
    required: styles.required,
    input: styles.input,
};

export const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginInput) => {
        setError(null);
        const result = await auth(data);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap="md">
                {error && <Alert color="red" variant="light" className={styles.alert}>{error}</Alert>}
                <TextInput
                    label="Email"
                    withAsterisk
                    type="email"
                    classNames={inputClassNames}
                    placeholder="example@mail.com"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <PasswordInput
                    label="Password"
                    withAsterisk
                    placeholder="*********"
                    classNames={{ ...inputClassNames, visibilityToggle: styles.visibilityToggle }}
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Button
                    type="submit"
                    fullWidth
                    className={styles.button}
                    loading={isSubmitting}
                    loaderProps={{ type: 'dots' }}
                >
                    Login
                </Button>
            </Stack>
        </form>
    )
}
