import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {LoggedInButton} from "@/components/wrappers/dashboard/LoggedInButton/LoggedInButton";
import {SidebarMenuCustom} from "@/components/wrappers/dashboard/SideBar/SideBarMenu/SideBarMenu";
import {OrganizationCombobox} from "@/components/wrappers/dashboard/Organization/organization-combobox";
import {prisma} from "@/prisma";
import {requiredCurrentUser} from "@/auth/current-user";
import {SideBarLogo} from "@/components/wrappers/Dashboard/SideBar/SideBarLogo/SideBarLogo";
import {SideBarFooterCredit} from "@/components/wrappers/Dashboard/SideBar/SideBarFooterCredit/SideBarFooterCredit";

export async function AppSidebar() {

    const user = await requiredCurrentUser()

    const organizations = await prisma.organization.findMany({
        where: {
            users: {
                some: {
                    userId: user.id
                },
            },
        },
    })
    const defaultOrganization = await prisma.organization.findUnique({
        where: {
            slug: "default"
        }
    })

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
               <SideBarLogo/>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <OrganizationCombobox
                            organizations={organizations}
                            defaultOrganization={defaultOrganization}
                        />
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
                <SideBarFooterCredit/>
            </SidebarFooter>
        </Sidebar>
    )
}