"use client"
import React, {useEffect, useState} from "react";
import {LayoutAdmin} from "@/components/layout";
import Image from "next/image";
import {env} from "@/env.mjs";
import {useTheme} from "next-themes";
import {useSession} from "@/lib/auth/auth-client";
import {useRouter} from "next/navigation";


export default function Layout({children}: { children: React.ReactNode }) {

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    if (session && session.user && !session.user.banned && session.user.role !== "pending") {
        router.replace("/dashboard/home");
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const imageTheme = resolvedTheme === "dark" ? "/images/logo-white.png" : "/images/logo-black.png";

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 ">
            <div className="mx-auto w-full max-w-md">
                <div className="sm:mx-auto sm:w-full sm:max-w-md flex items-center justify-center space-x-2">
                    <img
                        className="p-12 text-black dark:text-white"
                        src={imageTheme}
                        // loading="eager"
                        alt="Logo"
                        // width={1024}
                        // height={1024}
                    />
                    <span
                        className="text-sm text-muted-foreground -ml-12 -mb-12">
                        v{env.NEXT_PUBLIC_PROJECT_VERSION}
                    </span>
                </div>
                <div>{children}</div>
            </div>
            <footer className="py-4 text-center text-xs justify-items-end text-muted-foreground">
                Powered by <span className="font-medium">Soluce Technologies</span>
            </footer>
        </div>
    )
}