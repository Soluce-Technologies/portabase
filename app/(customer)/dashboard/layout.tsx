import {SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/wrappers/Dashboard/SideBar/app-sidebar";
import {currentUser} from "@/auth/current-user";
import {redirect} from "next/navigation";
import {LoggedInButton} from "@/components/wrappers/Dashboard/LoggedInButton/LoggedInButton";
import {ModeToggle} from "@/features/theme/ModeToggle";
import {Header} from "@/features/layout/Header";


export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser()
    if (!user) {
        redirect('/login')
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header/>
                <main>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}