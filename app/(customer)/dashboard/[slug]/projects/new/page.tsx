import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { ProjectForm } from "@/components/wrappers/dashboard/projects/ProjectsForm/ProjectForm";
import { notFound } from "next/navigation";
import { getCurrentOrganizationSlug } from "@/features/dashboard/organization-cookie";

import { db } from "@/db";
import { DatabaseWith, organization as drizzleOrganization } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function RoutePage(props: PageParams<{ slug: string }>) {
    const { slug: organizationSlug } = await props.params;

    const currentOrganizationSlug = await getCurrentOrganizationSlug();
    if (currentOrganizationSlug !== organizationSlug) {
        notFound();
    }

    const availableDatabases = (
        await db.query.database.findMany({
            where: (db, { isNull }) => isNull(db.projectId),
            with: {
                agent: true,
                project: true,
                backups: true,
                restorations: true,
            },
            orderBy: (db, { desc }) => [desc(db.createdAt)],
        })
    ).filter((db) => db.project !== null) as DatabaseWith[];

    const org = await db.query.organization.findFirst({
        where: eq(drizzleOrganization.slug, currentOrganizationSlug),
    });

    if (!org) notFound();

    return (
        <Page>
            <PageHeader>
                <PageTitle>Create new project</PageTitle>
            </PageHeader>
            <PageContent>
                <ProjectForm databases={availableDatabases} organization={org} />
            </PageContent>
        </Page>
    );
}
