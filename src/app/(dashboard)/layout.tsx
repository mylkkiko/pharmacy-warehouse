import AppLayout from "@/components/AppLayout/AppLayout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function Layout({ children }: LayoutProps<"/">) {
    const session = await auth();
    if(!session) {
        redirect("/login")
    }
    return (
        <AppLayout user={session?.user}>
            {children}    
        </AppLayout>
    )
}