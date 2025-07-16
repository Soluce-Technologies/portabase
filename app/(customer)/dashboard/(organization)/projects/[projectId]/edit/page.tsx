import {notFound} from "next/navigation";
import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {ProjectForm} from "@/components/wrappers/dashboard/projects/ProjectsForm/ProjectForm";
import * as drizzleDb from "@/db";

import {db} from "@/db";
import {eq} from "drizzle-orm";
import {DatabaseWith} from "@/db/schema/06_database";

export default async function RoutePage(props: PageParams<{ projectId: string }>) {
    const {projectId} = await props.params;

    const proj = await db.query.project.findFirst({
        where: eq(drizzleDb.schemas.project.id, projectId),
        with: {
            databases: true,
        },
    });

    if (!proj) {
        notFound();
    }


    const org = await db.query.organization.findFirst({
        where: eq(drizzleDb.schemas.organization.slug, "default"),
    });

    if (!org) {
        notFound();
    }

    const availableDatabases = (
        await db.query.database.findMany({
            where: (db, {or, eq, isNull}) => or(isNull(db.projectId), eq(db.projectId, proj.id)),
            with: {
                agent: true,
                project: true,
                backups: true,
                restorations: true,
            },
            orderBy: (db, {desc}) => [desc(db.createdAt)],
        })
    ).filter((db): db is DatabaseWith => db.project !== null);

    return (
        <Page>
            <PageHeader>
                <PageTitle>Edit {proj.name}</PageTitle>
            </PageHeader>
            <PageContent>
                <ProjectForm
                    organization={org}
                    databases={availableDatabases}
                    defaultValues={{name: proj.name, slug: proj.slug, databases: proj.databases.map((db) => db.id)}}
                    projectId={proj.id}
                />
            </PageContent>
        </Page>
    );
}
