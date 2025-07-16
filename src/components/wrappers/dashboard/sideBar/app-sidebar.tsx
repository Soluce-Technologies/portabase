import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu as SM,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {SidebarItem, SidebarMenu} from "@/components/wrappers/dashboard/sideBar/SideBarMenu/SideBarMenu";
import {OrganizationCombobox} from "@/components/wrappers/dashboard/organization/organization-combobox";
import {SideBarLogo} from "@/components/wrappers/dashboard/sideBar/SideBarLogo/SideBarLogo";
import {SideBarFooterCredit} from "@/components/wrappers/dashboard/sideBar/SideBarFooterCredit/SideBarFooterCredit";
import {LoggedInButton} from "@/components/wrappers/dashboard/loggedInButton/LoggedInButton";
import {Layers, ChartArea, Settings, ShieldHalf} from "lucide-react";
import {authClient} from "@/lib/auth/auth-client";
import {SidebarContentA} from "./sidebar-content";
import {getActiveMember, getOrganization} from "@/lib/auth/auth";
import {notFound} from "next/navigation";

export async function AppSidebar() {
    const member = await getActiveMember();

    console.log("member", member);

    if (!member) {
        return notFound();
    }

    const organization = await getOrganization({organizationId: member.organizationId});

    //todo: à revoir
    console.log("organization", organization);


    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SideBarLogo/>
                <SM>
                    <SidebarMenuItem>
                        <OrganizationCombobox/>
                    </SidebarMenuItem>
                </SM>
            </SidebarHeader>
            <SidebarContent>
                <SidebarContentA/>
            </SidebarContent>
            <SidebarFooter>
                <SM>
                    <SidebarMenuItem>
                        <LoggedInButton/>
                    </SidebarMenuItem>
                </SM>
                <SideBarFooterCredit/>
            </SidebarFooter>
        </Sidebar>
    );
}
