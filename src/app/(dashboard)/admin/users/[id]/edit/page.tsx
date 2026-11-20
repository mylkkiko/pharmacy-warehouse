import { UserForm } from "@/components/UserForm/UserForm";
import { updateUser } from "@/lib/actions/users";
import { userService } from "@/server/container";
import { Center } from "@mantine/core";
import { notFound } from "next/navigation";

export default async function EditUserPage(props: PageProps<"/admin/users/[id]/edit">) {
    const { id } = await props.params;
    const user = await userService.getById(id);
    if (!user) {
        return notFound();
    }

    return (
        <Center py="xl">
            <UserForm
                action={updateUser.bind(null, user.id)}
                mode="edit"
                defaultValues={{
                    name: user.name,
                    email: user.email,
                    password: "",
                    role: user.role
                }}
                title="Edit user"
                submitLabel="Save"
            />
        </Center>
    )
}
