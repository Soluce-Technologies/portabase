import {PageParams} from "@/types/next";

import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {prisma} from "@/prisma";
import {AdminTabs} from "@/components/wrappers/Dashboard/admin/admin-tabs";


export default async function RoutePage(props: PageParams<{}>) {


    const user = await requiredCurrentUser()

    const users = await prisma.user.findMany({
        where: {
            // id: {
            //     not: user.id
            // },
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
                    Administration Panel
                </PageTitle>
            </PageHeader>
            <PageContent className="mt-10">
                <AdminTabs settings={settings} currentUser={user} users={users}/>

            </PageContent>
        </Page>
    )
}