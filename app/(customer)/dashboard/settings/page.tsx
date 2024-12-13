import {prisma} from "@/prisma";
import {PageParams} from "@/types/next";
import {Page, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {SettingsTabs} from "@/components/wrappers/Dashboard/Settings/SettingsTabs/SettingsTabs";


export default async function RoutePage(props: PageParams<{}>) {
    const user = await requiredCurrentUser()

    const defaultOrganization = await prisma.organization.findUnique({
        where: {slug: "default"},
    });

    const users = await prisma.user.findMany({
        where: {
            organizations: {
                some: {
                    organizationId: defaultOrganization.id
                },
            },
            deleted: {not: true},

        }
    })

    console.log(users)

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