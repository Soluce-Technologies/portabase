"use client"
import {env} from "@/env.mjs";
import React, {useEffect, useState} from "react";
import {useTheme} from "next-themes";


export const AuthLogoSection = () => {

    const {resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;


    const imageTheme = resolvedTheme === "dark" ? "/images/logo-white.png" : "/images/logo-black.png";

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex items-center justify-center space-x-2">
            <img
                className="p-12 text-black dark:text-white"
                src={imageTheme}
                alt="Logo"
            />
            <span className="text-sm text-muted-foreground -ml-12 -mb-12">v{env.NEXT_PUBLIC_PROJECT_VERSION}</span>
        </div>
    )
}