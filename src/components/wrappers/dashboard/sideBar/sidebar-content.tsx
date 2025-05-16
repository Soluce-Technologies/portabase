"use client";
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarContent } from "@/components/ui/sidebar";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { Layers, ChartArea, Settings, ShieldHalf } from "lucide-react";
import { SidebarItem, SidebarMenu } from "./SideBarMenu/SideBarMenu";

export const SidebarContentA = () => {
    const { data: activeOrganization } = authClient.useActiveOrganization();
    const { data: organizations } = authClient.useListOrganizations();

    const { data: session } = useSession();

    console.log("sesssssion", session);

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

    if (activeOrganization) {
        const member = authClient.useActiveMember();

        if (member && member.data && (member.data.role === "admin" || member.data.role === "owner")) {
            appItems.push({
                type: "list",
                content: {
                    title: "Settings",
                    url: "settings",
                    icon: <Settings />,
                },
            });
        }
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
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu items={appItems} baseUrl={`/dashboard/${activeOrganization.slug}`} />
                    </SidebarGroupContent>
                </SidebarGroup>
                {/*(user.role === "superadmin" || user.role === "admin") && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu items={adminItems} baseUrl={`/dashboard/${organization.slug}`} />
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )*/}
            </SidebarContent>
        )
    );
};
