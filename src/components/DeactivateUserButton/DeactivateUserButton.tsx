"use client";

import { useState } from "react";
import { Alert, Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconUserCheck, IconUserOff } from "@tabler/icons-react";
import { activateUser, deactivateUser } from "@/lib/actions/users";

type DeactivateUserButtonProps = {
    userId: string;
    name: string;
    isActive: boolean;
};

export const DeactivateUserButton = ({ userId, name, isActive }: DeactivateUserButtonProps) => {
    const [opened, { open, close }] = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const actionLabel = isActive ? "Deactivate" : "Activate";

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        const result = isActive ? await deactivateUser(userId) : await activateUser(userId);

        if (result.error) {
            setError(result.error);
        } else {
            close();
            notifications.show({ message: isActive ? "User deactivated" : "User activated", color: "green" });
        }

        setLoading(false);
    };

    return (
        <>
            <Button
                color={isActive ? "red" : "green"}
                variant="subtle"
                size="xs"
                leftSection={isActive ? <IconUserOff size={16} /> : <IconUserCheck size={16} />}
                onClick={open}
            >
                {actionLabel}
            </Button>

            <Modal opened={opened} onClose={close} title={`${actionLabel} user`}>
                <Text mb="md">
                    {isActive
                        ? `Deactivate ${name}? They will no longer be able to sign in.`
                        : `Activate ${name}? They will be able to sign in again.`}
                </Text>

                {error && (
                    <Alert color="red" variant="light" mb="md">
                        {error}
                    </Alert>
                )}

                <Group justify="flex-end">
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button color={isActive ? "red" : "green"} loading={loading} onClick={handleConfirm}>
                        {actionLabel}
                    </Button>
                </Group>
            </Modal>
        </>
    );
};
