import {PageParams} from "@/types/next";
import {Page, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {prisma} from "@/prisma";
import {requiredCurrentUser} from "@/auth/current-user";
import {SettingsTabs} from "@/components/wrappers/Dashboard/Settings/SettingsTabs/SettingsTabs";


export default async function RoutePage(props: PageParams<{}>) {
    const user = await requiredCurrentUser()

    const users = await prisma.user.findMany({
        where:{
            id: {
                not: user.id
            }
        }
    })

    const settings = await prisma.settings.findUnique({
        where:{
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
                Manage your Portabase settings
            </PageDescription>
            <PageContent>
                <SettingsTabs settings={settings} users={users}/>
            </PageContent>
        </Page>
    )
}