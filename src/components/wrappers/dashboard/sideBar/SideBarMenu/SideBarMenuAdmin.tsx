"use client"

import {useEffect, useState} from "react";
import Link from "next/link";
import {SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {ChartArea, Layers, Settings, ShieldHalf} from "lucide-react";
import {usePathname} from "next/navigation";

export type SidebarMenuAdminProps = {}

export const SidebarMenuAdmin = (props: SidebarMenuAdminProps) => {

    const BASE_URL = "/dashboard";
    const pathname = usePathname();
    // Menu items.
    const items = [
        {
            title: "Agents",
            url: "agents",
            icon: ShieldHalf,
        },
        {
            title: "Administration panel",
            url: "admin",
            icon: Settings,
        },
    ]

    useEffect(() => {
        const currentUrl = pathname;
        const currentItem = items.find((item) => `${BASE_URL}/${item.url}` === currentUrl);
        if (currentItem) {
            setActiveItem(currentItem.title);
        }else{
            setActiveItem("");
        }
    }, [pathname]);

    const [activeItem, setActiveItem] = useState("");
    const handleItemClick = (title: string) => {
        setActiveItem(title);
        console.log(title)
    }
    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <Link
                            className={cn(buttonVariants({
                                size: "lg",
                                variant: activeItem === item.title ? "secondary" : 'ghost'
                            }), "justify-start p-0")}
                            href={`${BASE_URL}/${item.url}`}
                            onClick={() => handleItemClick(item.title)}
                        >
                            <item.icon/>
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                        className={`peer-data-[active=true]/menu-button:opacity-100 ${activeItem === item.title ? 'active' : ''}`}/>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}