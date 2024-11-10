"use client"
import {SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {PropsWithChildren, useState} from "react";
import {ChartArea, Home, Settings, ShieldHalf} from "lucide-react";

export type SidebarMenuCustomProps = {}

export const SidebarMenuCustom = (props: SidebarMenuCustomProps) => {

    const BASE_URL = "/dashboard";
    // Menu items.
    const items = [
        {
            title: "Home",
            url: "/",
            icon: Home,
        },
        {
            title: "Agents",
            url: "agents",
            icon: ShieldHalf,
        },
        {
            title: "Statistic",
            url: "kpi",
            icon: ChartArea,
        },
        {
            title: "Settings",
            url: "settings",
            icon: Settings,
        },
    ]

    const [activeItem, setActiveItem] = useState(items[0].title);
    const handleItemClick = (title: string) => {
        setActiveItem(title);
        console.log(title)
    }
    return(
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                        <Link
                            className={cn(buttonVariants({size: "lg", variant: activeItem === item.title ? "secondary" : 'ghost'}), "justify-start p-0")}
                            href={`${BASE_URL}/${item.url}`}
                            onClick={() => handleItemClick(item.title)}
                        >
                            <item.icon/>
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    <SidebarMenuAction className={`peer-data-[active=true]/menu-button:opacity-100 ${activeItem === item.title ? 'active' : ''}`}/>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}