import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {BackupButton} from "@/components/wrappers/dashboard/backup/backup-button/backup-button";
import {DatabaseTabs} from "@/components/wrappers/dashboard/projects/Database/DatabaseTabs";
import {DatabaseKpi} from "@/components/wrappers/dashboard/projects/Database/DatabaseKpi";
import {EditButton} from "@/components/wrappers/dashboard/database/EditButton/EditButton";
import {CronButton} from "@/components/wrappers/dashboard/database/CronButton/CronButton";


export default async function RoutePage(props: PageParams<{ databaseId: string }>) {

    const {databaseId} = await props.params
    const database = await prisma.database.findUnique({
        where: {
            id: databaseId,
        },
    })
    if (!database) {
        notFound()
    }


    const backups = await prisma.backup.findMany({
        where: {
            databaseId: database.id
        },
        include:{
            restorations: {}
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const restorations = await prisma.restoration.findMany({
        where: {
            databaseId: databaseId,
        },
        orderBy: {
            createdAt: "desc"
        }
    })


    const isAlreadyBackup = !!backups.find(backup => backup.status === "waiting");
    const isAlreadyRestore = !!restorations.find(restoration => restoration.status === "waiting");

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

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {database.name}
                    <EditButton/>
                    <CronButton database={database}/>
                </PageTitle>
                <PageActions className="justify-between">
                    <BackupButton disable={isAlreadyBackup} databaseId={databaseId}/>
                </PageActions>
            </div>
            <PageDescription className="mt-5 sm:mt-0">{database.description}</PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                <DatabaseKpi
                    successRate={successRate}
                    database={database}
                    totalBackups={totalBackups}
                />
                <DatabaseTabs
                    database={database}
                    isAlreadyRestore={isAlreadyRestore}
                    backups={backups}
                    restorations={restorations}
                />
            </PageContent>
        </Page>
    )
}