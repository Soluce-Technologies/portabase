import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    ChevronDown
} from "lucide-react";
import {LoggedInButton} from "@/components/wrappers/Dashboard/LoggedInButton/LoggedInButton";
import {SidebarMenuCustom} from "@/components/wrappers/Dashboard/SideBar/SideBarMenu/SideBarMenu";
import Image from 'next/image';

export function AppSidebar() {

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex justify-center items-center ">
                    <h1 className="font-bold text-xl">Portabase</h1>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Project
                                    <ChevronDown className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Project 1</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Project 2</span>
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
                        <SidebarMenuCustom/>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LoggedInButton/>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="text-center">
                    <h1 className="text-[10px]">Portabase Community Edition 1.0.0</h1>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}