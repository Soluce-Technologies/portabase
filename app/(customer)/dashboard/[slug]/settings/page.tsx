import {prisma} from "@/prisma";
import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {SettingsTabs} from "@/components/wrappers/dashboard/settings/SettingsTabs/SettingsTabs";
import {getCurrentOrganizationId, getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {Button} from "@/components/ui/button";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/DeleteOrganization/DeleteOrganizationButton";


export default async function RoutePage(props: PageParams<{}>) {
    const user = await requiredCurrentUser()

    const currentOrganizationSlug = await getCurrentOrganizationSlug()

    const organization = await prisma.organization.findUnique({
        where:{
            slug: currentOrganizationSlug,
        }
    })

    const users = await prisma.user.findMany({
        where: {
            organizations: {
                some: {
                    organizationId: organization.id
                },
            },
            deleted: {not: true},

        }
    })


    const settings = await prisma.settings.findUnique({
        where: {
            name: "system"
        }
    })

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Settings
                </PageTitle>
                <PageActions>
                    {/*<Button variant="destructive">Delete Organization</Button>*/}
                    <DeleteOrganizationButton organizationSlug={currentOrganizationSlug}/>
                </PageActions>
            </PageHeader>
            <PageDescription>
                Manage your organization settings.
            </PageDescription>
            <PageContent>
                <SettingsTabs settings={settings} currentUser={user} users={users}/>
            </PageContent>
        </Page>
    )
}