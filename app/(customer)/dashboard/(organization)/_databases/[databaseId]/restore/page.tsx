import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {notFound} from "next/navigation";
// import {RestoreForm} from "@/components/wrappers/dashboard/database/restore-form";
import {currentUser} from "@/lib/auth/current-user";

import {db} from "@/db";
import {eq} from "drizzle-orm";
import * as drizzleDb from "@/db";


export default async function RoutePage(
    props: PageParams<{
        databaseId: string;
    }>
) {
    const {databaseId} = await props.params;

    const user = await currentUser();
    if (!user) notFound();

    const [dbToRestore] = await db.select().from(drizzleDb.schemas.database).where(eq(drizzleDb.schemas.database.id, databaseId));

    if (!dbToRestore) {
        notFound();
    }

    const dbsOfSameType = await db.select().from(drizzleDb.schemas.database).where(eq(drizzleDb.schemas.database.dbms!, dbToRestore.dbms!));
    const successfulBackups = await db.select().from(drizzleDb.schemas.backup).where(eq(drizzleDb.schemas.backup.status, "success"));

    return (
        <Page>
            <PageHeader>
                <PageTitle>Restore {dbToRestore.name}</PageTitle>
            </PageHeader>
            <PageContent>
                {/*<RestoreForm databaseToRestore={dbToRestore} databases={dbsOfSameType} backups={successfulBackups}/>*/}
            </PageContent>
        </Page>
    );
}
