import { PageParams } from "@/types/next";
import { notFound } from "next/navigation";
import { Page, PageActions, PageContent, PageDescription, PageTitle } from "@/features/layout/page";
import { BackupButton } from "@/components/wrappers/dashboard/backup/backup-button/backup-button";
import { DatabaseTabs } from "@/components/wrappers/dashboard/projects/Database/DatabaseTabs";
import { DatabaseKpi } from "@/components/wrappers/dashboard/projects/Database/DatabaseKpi";
import { EditButton } from "@/components/wrappers/dashboard/database/EditButton/EditButton";
import { CronButton } from "@/components/wrappers/dashboard/database/CronButton/CronButton";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { backup as drizzleBackup, database as drizzleDatabase, restoration as drizzleRestoration } from "@/db/schema";

export default async function RoutePage(props: PageParams<{ databaseId: string }>) {
    const { databaseId } = await props.params;

    const dbItem = await db.query.database.findFirst({
        where: eq(drizzleDatabase.id, databaseId),
    });

    if (!dbItem) {
        notFound();
    }

    const backups = await db.query.backup.findMany({
        where: eq(drizzleBackup.databaseId, dbItem.id),
        with: {
            restorations: true,
        },
        orderBy: (b, { desc }) => [desc(b.createdAt)],
    });

    const restorations = await db.query.restoration.findMany({
        where: eq(drizzleRestoration.databaseId, dbItem.id),
        orderBy: (r, { desc }) => [desc(r.createdAt)],
    });

    const isAlreadyBackup = backups.some((b) => b.status === "waiting");
    const isAlreadyRestore = restorations.some((r) => r.status === "waiting");

    const [totalBackups, successfulBackups] = await Promise.all([
        db
            .select({ count: drizzleBackup.id })
            .from(drizzleBackup)
            .where(eq(drizzleBackup.databaseId, dbItem.id))
            .then((rows) => rows.length),
        db
            .select({ count: drizzleBackup.id })
            .from(drizzleBackup)
            .where(and(eq(drizzleBackup.databaseId, dbItem.id), eq(drizzleBackup.status, "success")))
            .then((rows) => rows.length),
    ]);

    const successRate = totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : null;

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {dbItem.name}
                    <EditButton />
                    <CronButton database={dbItem} />
                </PageTitle>
                <PageActions className="justify-between">
                    <BackupButton disable={isAlreadyBackup} databaseId={databaseId} />
                </PageActions>
            </div>
            <PageDescription className="mt-5 sm:mt-0">{dbItem.description}</PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                <DatabaseKpi successRate={successRate} database={dbItem} totalBackups={totalBackups} />
                <DatabaseTabs database={dbItem} isAlreadyRestore={isAlreadyRestore} backups={backups} restorations={restorations} />
            </PageContent>
        </Page>
    );
}
