import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { notFound } from "next/navigation";
import { RestoreForm } from "@/components/wrappers/dashboard/database/RestoreForm";
import { currentUser } from "@/lib/auth/current-user";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { database, backup } from "@/db/schema";

export default async function RoutePage(
    props: PageParams<{
        databaseId: string;
    }>
) {
    const { databaseId } = await props.params;

    const user = await currentUser();
    if (!user) notFound();

    const [dbToRestore] = await db.select().from(database).where(eq(database.id, databaseId));

    if (!dbToRestore) {
        notFound();
    }

    const dbsOfSameType = await db.select().from(database).where(eq(database.dbms!, dbToRestore.dbms!));

    const successfulBackups = await db.select().from(backup).where(eq(backup.status, "success"));

    return (
        <Page>
            <PageHeader>
                <PageTitle>Restore {dbToRestore.name}</PageTitle>
            </PageHeader>
            <PageContent>
                <RestoreForm databaseToRestore={dbToRestore} databases={dbsOfSameType} backups={successfulBackups} />
            </PageContent>
        </Page>
    );
}
