"use client"

import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader, SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarTrigger
} from "@/components/ui/sidebar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Calendar, ChevronDown, ChevronUp, Home, Inbox, Search, Settings, User2} from "lucide-react";
import Link from "next/link";
import {signOutAction} from "@/features/auth/auth.action";

export function AppSidebar() {

    const BASE_URL = "/dashboard";

    // Menu items.
    const items = [
        {
            title: "Home",
            url: "/",
            icon: Home,
        },
        {
            title: "Inbox",
            url: "/home",
            icon: Inbox,
        },
        {
            title: "Calendar",
            url: "#",
            icon: Calendar,
        },
        {
            title: "Search",
            url: "#",
            icon: Search,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Workspace
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Corp.</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`${BASE_URL}/${item.url}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    signOutAction()
                                }}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>

    )
}