import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { notFound } from "next/navigation";
import { DatabaseForm } from "@/components/wrappers/dashboard/database/DatabaseForm/DatabaseForm";

import { db } from "@/db";
import { database } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function RoutePage(props: PageParams<{ databaseId: string }>) {
    const { databaseId } = await props.params;

    const dbItem = await db.query.database.findFirst({
        where: eq(database.id, databaseId),
    });

    if (!dbItem) {
        notFound();
    }

    return (
        <Page>
            <PageHeader>
                <PageTitle>Edit {dbItem.name}</PageTitle>
            </PageHeader>
            <PageContent>
                <DatabaseForm
                    databaseId={databaseId}
                    defaultValues={{ ...dbItem, dbms: dbItem.dbms ?? "inactive", description: dbItem.description ?? undefined }}
                />
            </PageContent>
        </Page>
    );
}
