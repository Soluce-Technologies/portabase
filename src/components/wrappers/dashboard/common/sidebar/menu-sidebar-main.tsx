"use client"

import {Home, Settings, Target, Users, Pickaxe, Euro, BanknoteX, Layers, ChartArea, ShieldHalf} from "lucide-react";
import {SidebarGroupItem, SidebarMenuCustomBase} from "@/components/wrappers/dashboard/common/sidebar/menu-sidebar";
import {authClient, useSession} from "@/lib/auth/auth-client";


export const SidebarMenuCustomMain = () => {

    const BASE_URL = `/dashboard`;

    const { data: activeOrganization } = authClient.useActiveOrganization();
    const { data: organizations } = authClient.useListOrganizations();
    const {data: session, isPending, error} = authClient.useSession();
    const member = authClient.useActiveMember();


    if (isPending) return null;

    if (error || !session) {
        return null;
    }

    const groupContent: SidebarGroupItem["group_content"] = [
        { title: "Dashboard", url: "/home", icon: Home },
        { title: "Projects", url: "/projects", icon: Layers, details:true },
        { title: "Statistics", url: "/statistics", icon: ChartArea },
    ];

    if (activeOrganization && (member?.data?.role === "admin" || member?.data?.role === "owner")) {
        groupContent.push({ title: "Settings", url: "/settings", icon: Settings, details:true });
    }

    const items: SidebarGroupItem[] = [
        {
            label: "Application",
            type: "list",
            group_content: groupContent,
        },
    ];


    if (session?.user.role == "admin" || session?.user.role == "superadmin") {
        items.push({
            label: "Administration",
            type: "list",
            group_content: [
                {title: "Agents", url: "/agents", icon: ShieldHalf, details: true},
                {title: "Administration panel", url: "/admin", icon: Settings, details: true},
            ]
        })
    }


    return <SidebarMenuCustomBase baseUrl={BASE_URL} items={items}/>;
};
