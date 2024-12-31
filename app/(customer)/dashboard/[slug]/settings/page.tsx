import {prisma} from "@/prisma";
import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {SettingsTabs} from "@/components/wrappers/dashboard/settings/SettingsTabs/SettingsTabs";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/DeleteOrganization/DeleteOrganizationButton";
import {EditButtonSettings} from "@/components/wrappers/dashboard/settings/EditButtonSettings/EditButtonSettings";
import {notFound} from "next/navigation";


export default async function RoutePage(props: PageParams<{}>) {
    const user = await requiredCurrentUser()

    const currentOrganizationSlug = await getCurrentOrganizationSlug()

    const organization = await prisma.organization.findUnique({
        where: {
            slug: currentOrganizationSlug,
        },
        include: {
            users:{
                include:{
                    user: {}
                }
            }
        }
    })

    const currentOrganizationUser = await prisma.userOrganization.findFirst({
        where:{
            userId: user.id,
            organization:{
                slug: currentOrganizationSlug != "" ? currentOrganizationSlug : "default",
            }
        }
    })
    if (currentOrganizationUser.role != "admin") {
        notFound()
    }


    const settings = await prisma.settings.findUnique({
        where: {
            name: "system"
        }
    })

    return (
        <Page>
            <PageHeader>
                <PageTitle className="flex items-center">
                    Settings
                    {organization.slug != "default" ?
                        <EditButtonSettings/>
                        : null}
                </PageTitle>
                <PageActions>
                    {organization.slug != "default" ?
                        <DeleteOrganizationButton organizationSlug={currentOrganizationSlug}/>
                        : null}
                </PageActions>
            </PageHeader>
            <PageDescription>
                Manage your organization settings.
            </PageDescription>
            <PageContent>
                <SettingsTabs settings={settings} currentUser={user} users={organization.users}/>
            </PageContent>
        </Page>
    )
}