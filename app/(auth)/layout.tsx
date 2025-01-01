import React from "react";

import {LayoutAdmin} from "@/components/layout";
import {currentUser} from "@/auth/current-user";
import {redirect} from "next/navigation";
import {prisma} from "@/prisma";

export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser()
    if(user){
        const userInfo = await prisma.user.findUnique({
            where: {
                email: user?.email
            }
        })
        if(userInfo && userInfo.authMethod){
            redirect('/')
            // redirect('/dashboard')
        }
    }

    return (
        <LayoutAdmin>
            <div
                className="w-full h-full grid "
            >
                <div className="flex items-center justify-center py-12">
                    {children}
                </div>
            </div>
        </LayoutAdmin>
    )
}