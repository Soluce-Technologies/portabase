import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {ProjectForm} from "@/components/wrappers/dashboard/projects/project-form/project-form";
import {notFound} from "next/navigation";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {getOrganization} from "@/lib/auth/auth";
import * as drizzleDb from "@/db";
import {DatabaseWith} from "@/db/schema/06_database";

export default async function RoutePage(props: PageParams<{  }>) {

    const organization = await getOrganization({});

    if (!organization ) {
        notFound();
    }

    const availableDatabases = (
        await db.query.database.findMany({
            where: (db, {isNull}) => isNull(db.projectId),
            with: {
                agent: true,
                project: true,
                backups: true,
                restorations: true,
            },
            orderBy: (db, {desc}) => [desc(db.createdAt)],
        })
    ).filter((db) => db.project !== null) as DatabaseWith[];

    const org = await db.query.organization.findFirst({
        where: eq(drizzleDb.schemas.organization.slug, organization.slug),
    });

    if (!org) notFound();

    return (
        <Page>
            <PageHeader>
                <PageTitle>Create new project</PageTitle>
            </PageHeader>
            <PageContent>
                <ProjectForm databases={availableDatabases} organization={org}/>
            </PageContent>
        </Page>
    );
}
