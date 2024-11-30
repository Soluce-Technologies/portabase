import {
    Sidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {LoggedInButton} from "@/components/wrappers/Dashboard/LoggedInButton/LoggedInButton";
import {SidebarMenuCustom} from "@/components/wrappers/Dashboard/SideBar/SideBarMenu/SideBarMenu";
import {OrganizationComboBox} from "@/components/wrappers/organization/OrganizationCombobox";
import {prisma} from "@/prisma";

export async function AppSidebar() {

    const organizations = await prisma.organization.findMany({})
    const defaultOrganization = await prisma.organization.findUnique({
        where: {
            slug: "default"
        }
    })

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex justify-center items-center ">
                    <h1 className="font-bold text-xl">Portabase</h1>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <OrganizationComboBox
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
                <div className="text-center">
                    <h1 className="text-[10px]">Portabase Community Edition 1.0.0</h1>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}