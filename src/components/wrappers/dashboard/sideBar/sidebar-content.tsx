"use client";
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarContent } from "@/components/ui/sidebar";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { Layers, ChartArea, Settings, ShieldHalf } from "lucide-react";
import { SidebarItem, SidebarMenu } from "./SideBarMenu/SideBarMenu";

export const SidebarContentA = () => {
    const { data: activeOrganization } = authClient.useActiveOrganization();
    const { data: organizations } = authClient.useListOrganizations();
    const { data: session } = useSession();
    const member = authClient.useActiveMember(); // Moved here — always called


    const appItems: SidebarItem[] = [
        {
            type: "list",
            content: {
                title: "Projects",
                url: "projects",
                icon: <Layers />,
            },
        },
        {
            type: "list",
            content: {
                title: "Statistics",
                url: "statistics",
                icon: <ChartArea />,
            },
        },
    ];

    if (activeOrganization && member?.data?.role === "admin" || member?.data?.role === "owner") {
        appItems.push({
            type: "list",
            content: {
                title: "Settings",
                url: "settings",
                icon: <Settings />,
            },
        });
    }



    const adminItems: SidebarItem[] = [
        {
            type: "list",
            content: {
                title: "Agents",
                url: "agents",
                icon: <ShieldHalf />,
            },
        },
        {
            type: "list",
            content: {
                title: "Administration panel",
                url: "admin",
                icon: <Settings />,
            },
        },
    ];

    return (
        activeOrganization && (
                <>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu items={appItems} baseUrl={`/dashboard`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    {(session && (session.user.role === "admin" || session.user.role === "superadmin")) && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Administration</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu items={adminItems} baseUrl={`/dashboard`} />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}

                </>

        )
    );
};
