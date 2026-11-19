"use client";

import { useState } from "react";
import { Alert, Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { writeOffBatch } from "@/lib/actions/writeOffBatch";

type WriteOffButtonProps = {
    batchId: string;
    medicine: string;
    batchNumber: string;
    quantity: number;
    unit: string;
};

export const WriteOffButton = ({ batchId, medicine, batchNumber, quantity, unit }: WriteOffButtonProps) => {
    const [opened, { open, close }] = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleWriteOff = async () => {
        setLoading(true);
        setError(null);

        const result = await writeOffBatch(batchId);

        if (result.error) {
            setError(result.error);
        } else {
            close();
            notifications.show({ message: "Batch written off", color: "green" });
        }

        setLoading(false);
    };

    return (
        <>
            <Button color="red" variant="subtle" size="xs" leftSection={<IconTrash size={16} />} onClick={open}>
                Write off
            </Button>

            <Modal opened={opened} onClose={close} title="Write off batch">
                <Text mb="md">
                    Write off {quantity} {unit} of {medicine} ({batchNumber})? This cannot be undone.
                </Text>

                {error && (
                    <Alert color="red" variant="light" mb="md">
                        {error}
                    </Alert>
                )}

                <Group justify="flex-end">
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button color="red" loading={loading} onClick={handleWriteOff}>Write off</Button>
                </Group>
            </Modal>
        </>
    );
};