import { PageParams } from "@/types/next";
import { Page, PageActions, PageContent, PageDescription, PageTitle } from "@/features/layout/page";
import { buttonVariants } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ButtonDeleteProject } from "@/components/wrappers/dashboard/projects/ButtonDeleteProject/ButtonDeleteProject";
import { CardsWithPagination } from "@/components/wrappers/common/cards-with-pagination";
import { ProjectDatabaseCard } from "@/components/wrappers/dashboard/projects/ProjectCard/ProjectDatabaseCard";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import {getOrganization} from "@/lib/auth/auth";
import * as drizzleDb from "@/db";

export default async function RoutePage(props: PageParams<{
    // slug: string;
    projectId: string
}>) {
    const {
        // slug: organizationSlug,
        projectId } = await props.params;

    const organization = await getOrganization({});

    if (!organization) {
        notFound();
    }
    const org = await db.query.organization.findFirst({
        where: eq(drizzleDb.schemas.organization.slug, organization.slug),
    });

    if (!org) notFound();

    const proj = await db.query.project.findFirst({
        where: (proj, { and, eq, not }) => and(eq(proj.id, projectId), eq(proj.organizationId, org.id), not(eq(proj.isArchived, true))),
        with: {
            databases: true,
        },
    });

    if (!proj) notFound();

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {proj.name}
                    <Link className={buttonVariants({ variant: "outline" })} href={`/dashboard/projects/${proj.id}/edit`}>
                        <GearIcon className="w-7 h-7" />
                    </Link>
                </PageTitle>
                <PageActions className="justify-between">
                    <ButtonDeleteProject projectId={projectId} text={"Delete Project"} />
                </PageActions>
            </div>

            <PageDescription>The list of associated databases</PageDescription>

            <PageContent className="flex flex-col w-full h-full">
                {proj.databases.length > 0 ? (
                    <CardsWithPagination
                        data={proj.databases}
                        organizationSlug={organization.slug}
                        cardItem={ProjectDatabaseCard}
                        cardsPerPage={4}
                        numberOfColumns={1}
                        extendedProps={proj}
                    />
                ) : null}
            </PageContent>
        </Page>
    );
}
