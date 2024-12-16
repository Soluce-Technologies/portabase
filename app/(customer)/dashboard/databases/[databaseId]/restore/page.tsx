import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";
import {RestoreForm} from "@/components/wrappers/dashboard/database/RestoreForm";


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


    const databases = await prisma.database.findMany({
        where: {
            dbms: database.dbms,
        }
    })

    const backups = await prisma.backup.findMany({
        where: {
            status: "success",
        }
    });


    if (!database) {
        notFound();
    }


    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Restore {database.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <RestoreForm databaseToRestore={database} databases={databases} backups={backups}/>
            </PageContent>
        </Page>
    )
}