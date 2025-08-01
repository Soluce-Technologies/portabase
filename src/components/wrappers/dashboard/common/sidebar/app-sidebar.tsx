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
import {OrganizationCombobox} from "@/components/wrappers/dashboard/organization/organization-combobox";
import {LoggedInButton} from "@/components/wrappers/dashboard/common/logged-in/logged-in-button";

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

            <SidebarMenu className="mb-2">
                <SidebarMenuItem>
                    <LoggedInButton />
                </SidebarMenuItem>
            </SidebarMenu>
            <SideBarFooterCredit />
        </Sidebar>
    );
}
