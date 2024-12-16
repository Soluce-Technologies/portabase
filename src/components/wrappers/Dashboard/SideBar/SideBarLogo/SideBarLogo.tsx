"use client"
import {useSidebar} from "@/components/ui/sidebar";

export type SideBarLogoProps = {}

export const SideBarLogo = (props: SideBarLogoProps) => {
    const { state, isMobile } = useSidebar();
    return (
        <div className="flex justify-center items-center ">
            <h1 className="font-bold text-xl">
                {state === 'collapsed' && !isMobile ? "P" : "Portabase"}
                </h1>
        </div>
    )
}