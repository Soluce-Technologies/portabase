import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {BackupButton} from "@/components/wrappers/BackupButton/BackupButton";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {DatabaseTabs} from "@/components/wrappers/Dashboard/Projects/Database/DatabaseTabs";
import {formatDateLastContact} from "@/utils/date-formatting";


export default async function RoutePage(props: PageParams<{ databaseId: string }>) {

    const {databaseId} = await props.params

    const database = await prisma.database.findUnique({
        where: {
            id: databaseId,
        },
    })
    console.log("database", database)

    if (!database) {
        notFound()
    }

    const backups = await prisma.backup.findMany({
        where: {
            databaseId: database.id
        }
    })
    console.log(backups)

    const totalBackups = await prisma.backup.count({
        where: {
            databaseId: databaseId,
        },
    });

    const successfulBackups = await prisma.backup.count({
        where: {
            databaseId: databaseId,
            status: 'success',
        },
    });

    const successRate = totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : null

    // const restaurations = await prisma.restauration.findMany({
    //     where: {
    //         databaseId: databaseId,
    //     }
    // })


    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {database.name}
                </PageTitle>
                <PageActions className="justify-between">
                    <BackupButton databaseId={databaseId} />
                </PageActions>
            </div>
            <PageDescription className="mt-5 sm:mt-0">{database.description}</PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8 mb-6">
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Backups
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Success rate
                        </CardHeader>
                        <CardContent>
                            {successRate ?? "Unavailable for now."}
                        </CardContent>
                    </Card>
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Last contact
                        </CardHeader>
                        <CardContent>
                            {formatDateLastContact(database.lastContact)}
                        </CardContent>
                    </Card>
                </div>

                <DatabaseTabs
                    backups={backups}
                    // restaurations={restaurations}
                />
            </PageContent>
        </Page>
    )
}