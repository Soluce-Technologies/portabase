import React from "react";
import {currentUser} from "@/auth/current-user";
import {notFound} from "next/navigation";

export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser()
    if(user.role != "admin"){
        notFound()
    }
    return (
        <>
        {children}
        </>
    )
}