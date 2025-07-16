import React from "react";
import {redirect} from "next/navigation";

import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/wrappers/dashboard/sideBar/app-sidebar";
import {Header} from "@/features/layout/Header";
import {currentUser} from "@/lib/auth/current-user";

export default async function Layout({children}: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) redirect("/login");

    return (
        <>
            <SidebarProvider>
                <div className="flex flex-col lg:flex-row w-full">
                    <AppSidebar/>
                    <SidebarInset>
                        <Header/>
                        <main className="h-full">{children}</main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    );
}
