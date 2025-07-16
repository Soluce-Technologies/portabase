import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvolutionLineChart } from "@/components/wrappers/dashboard/statistics/charts/evolution-line-chart";
import { PercentageLineChart } from "@/components/wrappers/dashboard/statistics/charts/percentage-line-chart";
import { getCurrentOrganizationSlug } from "@/features/dashboard/organization-cookie";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { asc, count, eq, inArray } from "drizzle-orm";
import * as drizzleDb from "@/db";
import {getOrganization} from "@/lib/auth/auth";

export default async function RoutePage(props: PageParams<{ }>) {
    const organization = await getOrganization({});

    if (!organization) {
        notFound();
    }

    const org = await db.query.organization.findFirst({
        where: eq(drizzleDb.schemas.organization.slug, organization.slug),
    });

    if (!org) notFound();

    const projects = await db.query.project.findMany({
        where: eq(drizzleDb.schemas.project.organizationId, org.id),
    });

    const projectsCount = projects.length;

    const backupsEvolution = await db.query.backup.findMany({
        columns: {
            id: true,
            createdAt: true,
        },
        orderBy: [asc(drizzleDb.schemas.backup.id)],
    });

    const backupsRate = await db
        .select({
            createdAt: drizzleDb.schemas.backup.createdAt,
            status: drizzleDb.schemas.backup.status,
            _count: count(),
        })
        .from(drizzleDb.schemas.backup)
        .where(inArray(drizzleDb.schemas.backup.status, ["success", "failed"]))
        .groupBy(drizzleDb.schemas.backup.createdAt, drizzleDb.schemas.backup.status)
        .orderBy(drizzleDb.schemas.backup.createdAt);

    return (
        <Page>
            <PageHeader>
                <PageTitle>Statistics</PageTitle>
            </PageHeader>
            <PageContent className="flex flex-col gap-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Projects</CardTitle>
                        </CardHeader>
                        <CardContent>{projectsCount}</CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>KPI 2</CardTitle>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>KPI 3</CardTitle>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Evolution of the number of backups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EvolutionLineChart data={backupsEvolution} />
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Success rate of backups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PercentageLineChart data={backupsRate} />
                        </CardContent>
                    </Card>
                </div>
            </PageContent>
        </Page>
    );
}
