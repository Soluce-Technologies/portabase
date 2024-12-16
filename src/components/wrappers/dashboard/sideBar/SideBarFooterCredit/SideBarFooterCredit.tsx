"use client"
import {useSidebar} from "@/components/ui/sidebar";

export type SideBarFooterCreditProps = {}

export const SideBarFooterCredit = (props: SideBarFooterCreditProps) => {
    const {state, isMobile} = useSidebar();

    return (
        <>
            {state === 'expanded' && (
                <div className="text-center">
                    <h1 className="text-[10px]">Portabase Community Edition</h1>
                </div>
            )}
        </>
    )
}