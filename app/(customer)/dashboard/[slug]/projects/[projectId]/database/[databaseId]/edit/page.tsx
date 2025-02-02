import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";
import {DatabaseForm} from "@/components/wrappers/dashboard/database/DatabaseForm/DatabaseForm";


export default async function RoutePage(props: PageParams<{
    databaseId: string;
}>) {

    const {databaseId} = await props.params

    const user = await requiredCurrentUser()
    const database = await prisma.database.findUnique({
        where: {
            id: databaseId,
        }
    });

    if (!database) {
        notFound();
    }


    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Edit {database.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <DatabaseForm databaseId={databaseId} defaultValues={database}/>
            </PageContent>
        </Page>
    )
}