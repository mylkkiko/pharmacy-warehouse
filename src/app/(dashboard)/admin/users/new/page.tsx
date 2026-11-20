import { UserForm } from "@/components/UserForm/UserForm";
import { createUser } from "@/lib/actions/users";
import { Center } from "@mantine/core";

export default function CreateUserPage() {
    return (
        <Center py="xl">
            <UserForm
                action={createUser}
                mode="create"
                title="Add new user"
                description="Create an account for a pharmacist or an admin"
                submitLabel="Create"
            />
        </Center>
    )
}
