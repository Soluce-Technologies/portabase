import { notFound } from "next/navigation";
import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { ProjectForm } from "@/components/wrappers/dashboard/projects/ProjectsForm/ProjectForm";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { project as drizzleProject, organization as drizzleOrganization, DatabaseWith } from "@/db/schema";

export default async function RoutePage(props: PageParams<{ projectId: string }>) {
    const { projectId } = await props.params;

    const proj = await db.query.project.findFirst({
        where: eq(drizzleProject.id, projectId),
        with: {
            databases: true,
        },
    });

    if (!proj) {
        notFound();
    }

    //
    const org = await db.query.organization.findFirst({
        where: eq(drizzleOrganization.slug, "default"),
    });

    if (!org) {
        notFound();
    }

    const availableDatabases = (
        await db.query.database.findMany({
            where: (db, { or, eq, isNull }) => or(isNull(db.projectId), eq(db.projectId, proj.id)),
            with: {
                agent: true,
                project: true,
                backups: true,
                restorations: true,
            },
            orderBy: (db, { desc }) => [desc(db.createdAt)],
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
                    defaultValues={{ name: proj.name, slug: proj.slug, databases: proj.databases.map((db) => db.id) }}
                    projectId={proj.id}
                />
            </PageContent>
        </Page>
    );
}
