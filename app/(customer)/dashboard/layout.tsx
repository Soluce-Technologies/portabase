import React from "react";
import {redirect} from "next/navigation";

import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/wrappers/Dashboard/SideBar/app-sidebar";
import {currentUser} from "@/auth/current-user";
import {Header} from "@/features/layout/Header";
import {prisma} from "@/prisma";


export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser()
    console.log(user)
    if(user){
        const userInfo = await prisma.user.findUnique({
            where: {
                email: user?.email
            }
        })
        if (!userInfo) redirect('/login')
    }
    if (!user) redirect('/login')


    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <Header/>
                <main className="h-full">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}