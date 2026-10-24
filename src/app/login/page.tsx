import { LoginForm } from "@/components/LoginForm/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Center, Paper, Stack, Text, Title } from "@mantine/core"
import styles from "./page.module.css";

export default async function Login() {
    const session = await auth();
    if(session?.user) {
        redirect('/');
    };

    return (
        <Center className={styles.page}>
            <Paper radius="lg" className={styles.card}>
                <Stack gap="xl">
                    <Stack gap={4}>
                        <Title order={2} className={styles.title}>
                            Sign <span className={styles.accent}>In</span>
                        </Title>
                        <Text size="sm" className={styles.subtitle}>
                            Pharmacy warehouse management
                        </Text>
                    </Stack>
                    <LoginForm />
                </Stack>
            </Paper>
        </Center>
    );
}
