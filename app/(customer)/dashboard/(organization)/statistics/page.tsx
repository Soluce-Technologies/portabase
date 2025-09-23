import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {EvolutionLineChart} from "@/components/wrappers/dashboard/statistics/charts/evolution-line-chart";
import {PercentageLineChart} from "@/components/wrappers/dashboard/statistics/charts/percentage-line-chart";
import {notFound} from "next/navigation";
import {db} from "@/db";
import {and, asc, count, eq, inArray} from "drizzle-orm";
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



    // const tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    //
    // const before = new Date();
    // before.setDate(before.getDate() - 1);
    //
    // const backupsEvolution = [
    //     {
    //         id: '22e84aa4-228c-45b3-82ec-846a639cd509',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: '2c114dc3-1fa6-4ef1-972c-9765c65e9331',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: '2c114dc3-1fa6-4ef1-972c-9765c65e9331',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: '2c114dc3-1fa6-4ef1-972c-9765c65e9331',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: '2c114dc3-1fa6-4ef1-972c-9765c65e9331',
    //         createdAt: new Date(before)
    //     },
    //     {
    //         id: '6a6106fe-7f45-48eb-a56f-0a1e734126a1',
    //         createdAt: new Date(before)
    //     },
    //     {
    //         id: 'a529d790-502e-4609-ad37-9b1c00c73477',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: 'a8c105a8-3e29-423e-b7dd-d3218092cde1',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: 'd33aaf4f-8525-4490-addb-12e3c8650d6d',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: 'f1d5a4e2-1c33-41c4-932b-02456c2a6f1d',
    //         createdAt: new Date(tomorrow)
    //     },
    //     {
    //         id: 'f1d5a4e2-1c33-41c4-932b-02456c2a6f1d',
    //         createdAt: new Date(tomorrow)
    //     },
    //     {
    //         id: 'e88a588a-2353-4470-9976-8c3eb2ffc88d',
    //         createdAt: new Date()
    //     },
    //     {
    //         id: 'ee11441e-4b41-4c1b-9d91-929565b4204a',
    //         createdAt: new Date()
    //     },
    //
    //     // Entries with tomorrow's date
    //     {
    //         id: 'f1d5a4e2-1c33-41c4-932b-02456c2a6f1d',
    //         createdAt: new Date(tomorrow)
    //     },
    //     {
    //         id: 'c0a8323d-9241-4896-9e64-01e905c24e51',
    //         createdAt: new Date(tomorrow)
    //     }
    // ];


    const backupsRate = await db
        .select({
            createdAt: drizzleDb.schemas.backup.createdAt,
            status: drizzleDb.schemas.backup.status,
            _count: count(),
        })
        .from(drizzleDb.schemas.backup)
        .where(and(inArray(drizzleDb.schemas.backup.status, ["success", "failed"]), inArray(drizzleDb.schemas.backup.databaseId, databaseIds)))
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


    const sortedBackupsEvolution = backupsEvolution.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

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
                            <EvolutionLineChart data={sortedBackupsEvolution}/>
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
