import {SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/wrappers/Dashboard/SideBar/app-sidebar";
import {currentUser} from "@/auth/current-user";
import {redirect} from "next/navigation";


export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <SidebarProvider>
            <AppSidebar/>
            <main>
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    )
}