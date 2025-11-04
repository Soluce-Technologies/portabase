import React from "react";
import {redirect} from "next/navigation";
import {currentUser} from "@/lib/auth/current-user";
import {AuthLogoSection} from "@/components/wrappers/auth/auth-logo-section";

export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser();

    if (user && !user.banned && user.role !== "pending") {
        redirect("/dashboard/home");
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 ">
            <div className="mx-auto w-full max-w-md">
                <AuthLogoSection/>
                <div>{children}</div>
            </div>
            <footer className="py-4 text-center text-xs justify-items-end text-muted-foreground">
                Powered by <span className="font-medium">Soluce Technologies</span>
            </footer>
        </div>
    )
}