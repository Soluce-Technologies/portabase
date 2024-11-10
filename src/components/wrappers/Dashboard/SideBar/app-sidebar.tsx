import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu, SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    ChartArea,
    ChevronDown,
    Home,
    Settings,
    ShieldHalf,
} from "lucide-react";
import Link from "next/link";

import {LoggedInButton} from "@/components/wrappers/Dashboard/LoggedInButton/LoggedInButton";
import {buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils";


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

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Workspace
                                    <ChevronDown className="ml-auto"/>
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
                                        <Link
                                            className={cn(buttonVariants({
                                                size: "lg",
                                                variant: "ghost"
                                            }), "justify-start p-0")}
                                            href={`${BASE_URL}/${item.url}`}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100"/>

                                </SidebarMenuItem>

                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/*<DropdownMenu>*/}
                        {/*    <DropdownMenuTrigger asChild>*/}
                        {/*        <SidebarMenuButton>*/}
                        {/*            <UserAvatar/>*/}
                        {/*            <User2 /> Username*/}
                        {/*            <ChevronUp className="ml-auto" />*/}
                        {/*        </SidebarMenuButton>*/}
                        {/*    </DropdownMenuTrigger>*/}
                        {/*    <DropdownMenuContent*/}
                        {/*        side="top"*/}
                        {/*        className="w-[--radix-popper-anchor-width]"*/}
                        {/*    >*/}
                        {/*        <DropdownMenuItem>*/}
                        {/*            <span>Account</span>*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*        <DropdownMenuItem>*/}
                        {/*            <span>Billing</span>*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*        /!*<DropdownMenuItem onClick={() => {*!/*/}
                        {/*        /!*    signOutAction()*!/*/}
                        {/*        /!*}}>*!/*/}
                        {/*        /!*    <span>Sign out</span>*!/*/}
                        {/*        /!*</DropdownMenuItem>*!/*/}
                        {/*    </DropdownMenuContent>*/}
                        {/*</DropdownMenu>*/}


                        <LoggedInButton/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>

    )
}