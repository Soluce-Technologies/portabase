"use client"

import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export const SidebarLogo = ({projectName}: {
    projectName: string;
}) => {
    const { state, isMobile } = useSidebar();
    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const imageTheme = resolvedTheme === "dark" ? "/images/logo-white.png" : "/images/logo-black.png";

    return (
        <div className="ml-1 flex items-center justify-center">
            <Link href={"/"}>
                {state === 'collapsed' && !isMobile ? (
                    <Image
                        loading="eager"
                        src={"/images/logo.png"}
                        alt={`Logo ${projectName}`}
                        className="h-10 w-10 object-contain"
                        height={10}
                        width={10}
                    />
                ) : (
                    <div className="m-4">
                        <Image
                            loading="eager"
                            src={imageTheme}
                            alt={`Logo ${projectName}`}
                            className="object-contain"
                            width={190}
                            height={90}
                        />
                    </div>
                )}
            </Link>
        </div>
    );
};
