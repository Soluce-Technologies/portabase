import {prisma} from "@/prisma";
import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {SettingsTabs} from "@/components/wrappers/dashboard/settings/SettingsTabs/SettingsTabs";
import {getCurrentOrganizationId} from "@/features/dashboard/organization-cookie";
import {Button} from "@/components/ui/button";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/DeleteOrganization/DeleteOrganizationButton";


export default async function RoutePage(props: PageParams<{}>) {
    const user = await requiredCurrentUser()

    const currentOrganizationId = await getCurrentOrganizationId()

    const users = await prisma.user.findMany({
        where: {
            organizations: {
                some: {
                    organizationId: currentOrganizationId
                },
            },
            deleted: {not: true},

        }
    })

    console.log(currentOrganizationId)

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
                    <DeleteOrganizationButton organizationId={currentOrganizationId}/>
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