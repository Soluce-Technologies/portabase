import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {EvolutionLineChart} from "@/components/wrappers/dashboard/statistics/charts/evolution-line-chart";
import {PercentageLineChart} from "@/components/wrappers/dashboard/statistics/charts/percentage-line-chart";
import {notFound} from "next/navigation";
import {db} from "@/db";
import {asc, count, eq, inArray} from "drizzle-orm";
import * as drizzleDb from "@/db";
import {getOrganization} from "@/lib/auth/auth";
import {DatabaseBackup, Folder, RefreshCcw} from "lucide-react";

export default async function RoutePage(props: PageParams<{}>) {
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

    const projectIds = projects.map(project => project.id);

    const databasesOfAllProjects = await db.query.database.findMany({
        where: inArray(drizzleDb.schemas.database.projectId, projectIds),
    })
    const databaseIds = databasesOfAllProjects.map((database) => database.id);


    const backupsEvolution = await db.query.backup.findMany({
        columns: {
            id: true,
            createdAt: true,
        },
        orderBy: [asc(drizzleDb.schemas.backup.id)],
        where: inArray(drizzleDb.schemas.backup.databaseId, databaseIds),
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



    const restorationsCountResult = await db
        .select({
            count: count(),
        })
        .from(drizzleDb.schemas.restoration)
        .where(inArray(drizzleDb.schemas.restoration.databaseId, databaseIds));



    const restorationsCount = restorationsCountResult[0]?.count ?? 0;
    const projectsCount = projects.length;
    const backupsEvolutionCount = backupsEvolution.length;


    return (
        <Page>
            <PageHeader>
                <PageTitle>Statistics</PageTitle>
            </PageHeader>
            <PageContent className="flex flex-col gap-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full flex-1">
                        <CardHeader className="flex items-center gap-2">
                            <Folder className="w-5 h-5 text-muted-foreground" />
                            <CardTitle>Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{projectsCount}</CardContent>
                    </Card>
                    <Card className="w-full flex-1">
                        <CardHeader className="flex items-center gap-2">
                            <DatabaseBackup className="w-5 h-5 text-muted-foreground" />
                            <CardTitle>Backups</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{backupsEvolutionCount}</CardContent>
                    </Card>
                    <Card className="w-full flex-1">
                        <CardHeader className="flex items-center gap-2">
                            <RefreshCcw className="w-5 h-5 text-muted-foreground" />
                            <CardTitle>Restorations</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{restorationsCount}</CardContent>
                    </Card>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Evolution of the number of backups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EvolutionLineChart data={backupsEvolution}/>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Success rate of backups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PercentageLineChart data={backupsRate}/>
                        </CardContent>
                    </Card>
                </div>
            </PageContent>
        </Page>
    );
}
