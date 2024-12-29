import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {SidebarMenuCustom} from "@/components/wrappers/dashboard/sideBar/SideBarMenu/SideBarMenu";
import {OrganizationCombobox} from "@/components/wrappers/dashboard/organization/organization-combobox";
import {prisma} from "@/prisma";
import {requiredCurrentUser} from "@/auth/current-user";
import {SideBarLogo} from "@/components/wrappers/dashboard/sideBar/SideBarLogo/SideBarLogo";
import {SideBarFooterCredit} from "@/components/wrappers/dashboard/sideBar/SideBarFooterCredit/SideBarFooterCredit";
import {LoggedInButton} from "@/components/wrappers/dashboard/loggedInButton/LoggedInButton";
import {db} from "@/db";
import {checkAllPermissions} from "@/features/permissions/permissions";
import {SidebarMenuAdmin} from "@/components/wrappers/dashboard/sideBar/SideBarMenu/SideBarMenuAdmin";

export async function AppSidebar() {

    const user = await requiredCurrentUser()
    const organizations = await prisma.organization.findMany({
        where: {
            users: {
                some: {
                    userId: user.id
                },
            },
            deleted: {not: true},
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
                {user.role == "admin" ?
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenuAdmin/>
                        </SidebarGroupContent>
                    </SidebarGroup>
                :null}
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