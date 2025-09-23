import {PageParams} from "@/types/next";
import {notFound, redirect} from "next/navigation";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {BackupButton} from "@/components/wrappers/dashboard/backup/backup-button/backup-button";
import {DatabaseTabs} from "@/components/wrappers/dashboard/projects/database/database-tabs";
import {DatabaseKpi} from "@/components/wrappers/dashboard/projects/database/database-kpi";
import {EditButton} from "@/components/wrappers/dashboard/database/edit-button/edit-button";
import {CronButton} from "@/components/wrappers/dashboard/database/cron-button/cron-button";

import {db} from "@/db";
import {eq, and, inArray} from "drizzle-orm";
import * as drizzleDb from "@/db";
import {getOrganizationProjectDatabases} from "@/lib/services";
import {getOrganization} from "@/lib/auth/auth";
import {RetentionPolicySheet} from "@/components/wrappers/dashboard/database/retention-policy/retention-policy-sheet";
import {capitalizeFirstLetter} from "@/utils/text";

export default async function RoutePage(props: PageParams<{
    projectId: string;
    databaseId: string
}>) {
    const {projectId, databaseId} = await props.params;

    const organization = await getOrganization({});

    if (!organization) {
        notFound();
    }

    const databasesProject = await getOrganizationProjectDatabases({
        organizationSlug: organization.slug,
        projectId: projectId
    })

    const dbItem = await db.query.database.findFirst({
        where: and(inArray(drizzleDb.schemas.backup.id, databasesProject.ids ?? []), eq(drizzleDb.schemas.database.id, databaseId), eq(drizzleDb.schemas.database.projectId, projectId)),
        with: {
            project: true,
            retentionPolicy: true
        }
    });

    if (!dbItem) {
        redirect("/dashboard/projects");
    }

    const backups = await db.query.backup.findMany({
        where: eq(drizzleDb.schemas.backup.databaseId, dbItem.id),
        with: {
            restorations: true,
        },
        orderBy: (b, {desc}) => [desc(b.createdAt)],
    });

    const restorations = await db.query.restoration.findMany({
        where: eq(drizzleDb.schemas.restoration.databaseId, dbItem.id),
        orderBy: (r, {desc}) => [desc(r.createdAt)],
    });

    const isAlreadyBackup = backups.some((b) => b.status === "waiting");
    const isAlreadyRestore = restorations.some((r) => r.status === "waiting");

    const totalBackups = await db.select({count: drizzleDb.schemas.backup.id})
        .from(drizzleDb.schemas.backup)
        .where(eq(drizzleDb.schemas.backup.databaseId, dbItem.id))
        .then(rows => rows.length);

    const availableBackups = backups.filter(b => !b.deletedAt).length;

    const successfulBackups = await db.select({count: drizzleDb.schemas.backup.id})
        .from(drizzleDb.schemas.backup)
        .where(and(
            eq(drizzleDb.schemas.backup.databaseId, dbItem.id),
            eq(drizzleDb.schemas.backup.status, "success")
        ))
        .then(rows => rows.length);


    const [settings] = await db.select().from(drizzleDb.schemas.setting).where(eq(drizzleDb.schemas.setting.name, "system")).limit(1);
    if (!settings) {
        notFound();
    }

    const successRate = totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : null;

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center justify-between w-full">
                    {capitalizeFirstLetter(dbItem.name)}
                    <div className="flex items-center gap-2 justify-between w-full">
                        <div className="flex items-center gap-2">
                            <EditButton/>
                            <RetentionPolicySheet database={dbItem}/>
                            <CronButton database={dbItem}/>
                        </div>
                        <div className="flex items-center gap-2">
                            <BackupButton disable={isAlreadyBackup} databaseId={databaseId}/>
                        </div>
                    </div>
                </PageTitle>
            </div>

            {dbItem.description && (
                <PageDescription className="mt-5 sm:mt-0">{dbItem.description}</PageDescription>
            )}
            <PageContent className="flex flex-col w-full h-full">
                <DatabaseKpi successRate={successRate} database={dbItem} availableBackups={availableBackups}
                             totalBackups={totalBackups}/>
                <DatabaseTabs settings={settings} database={dbItem} isAlreadyRestore={isAlreadyRestore}
                              backups={backups}
                              restorations={restorations}/>
            </PageContent>
        </Page>
    );
}
