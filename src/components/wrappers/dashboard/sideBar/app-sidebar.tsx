import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu as SM,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {OrganizationCombobox} from "@/components/wrappers/dashboard/organization/organization-combobox";
import {SideBarLogo} from "@/components/wrappers/dashboard/sideBar/SideBarLogo/SideBarLogo";
import {SideBarFooterCredit} from "@/components/wrappers/dashboard/sideBar/SideBarFooterCredit/SideBarFooterCredit";
import {LoggedInButton} from "@/components/wrappers/dashboard/loggedInButton/LoggedInButton";
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
