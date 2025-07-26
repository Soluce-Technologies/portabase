import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {SidebarLogo} from "@/components/wrappers/dashboard/common/sidebar/logo-sidebar";
import {SidebarMenuCustomMain} from "@/components/wrappers/dashboard/common/sidebar/menu-sidebar-main";
import {SideBarFooterCredit} from "@/components/wrappers/dashboard/common/sidebar/side-bar-footer-credit";
import {LoggedInButton} from "@/components/wrappers/dashboard/loggedInButton/LoggedInButton";
import {OrganizationCombobox} from "@/components/wrappers/dashboard/organization/organization-combobox";

export function AppSidebar() {

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarLogo/>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <OrganizationCombobox/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenuCustomMain/>
            </SidebarContent>

            <SidebarMenu>
                <SidebarMenuItem>
                    <LoggedInButton />
                </SidebarMenuItem>
            </SidebarMenu>
            <SideBarFooterCredit />
        </Sidebar>
    );
}
