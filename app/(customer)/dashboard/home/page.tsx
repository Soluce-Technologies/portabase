import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Building2, DatabaseBackup, Folder, RefreshCcw} from "lucide-react";
import {EvolutionLineChart} from "@/components/wrappers/dashboard/statistics/charts/evolution-line-chart";
import {PercentageLineChart} from "@/components/wrappers/dashboard/statistics/charts/percentage-line-chart";
import {currentUser} from "@/lib/auth/current-user";
import {notFound} from "next/navigation";
import {db} from "@/db";
import {asc, eq, inArray} from "drizzle-orm";
import * as drizzleDb from "@/db";
import {auth, listOrganizations} from "@/lib/auth/auth";
import {authClient} from "@/lib/auth/auth-client";

export default async function RoutePage(props: PageParams<{}>) {

    const user = await currentUser();
    const organizations = await listOrganizations()

    if (!user || !organizations) notFound();

    const organizationIds = organizations.map(project => project.id);


    const projects = await db.query.project.findMany({
        where: inArray(drizzleDb.schemas.project.organizationId, organizationIds),
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


    return (

        <Page>
            <PageHeader>
                <PageTitle>Dashboard</PageTitle>
            </PageHeader>
            <PageContent className="flex flex-col gap-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full flex-1">
                        <CardHeader className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-muted-foreground"/>
                            <CardTitle>Organizations</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{organizations.length}</CardContent>
                    </Card>
                    <Card className="w-full flex-1">
                        <CardHeader className="flex items-center gap-2">
                            <Folder className="w-5 h-5 text-muted-foreground"/>
                            <CardTitle>Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{projects.length}</CardContent>
                    </Card>
                    <Card className="w-full flex-1">
                        <CardHeader className="flex items-center gap-2">
                            <DatabaseBackup className="w-5 h-5 text-muted-foreground"/>
                            <CardTitle>Backups</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{backupsEvolution.length}</CardContent>
                    </Card>

                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50"/>
                        <div className="aspect-video rounded-xl bg-muted/50"/>
                        <div className="aspect-video rounded-xl bg-muted/50"/>
                    </div>
                </div>
            </PageContent>
        </Page>

    );
}
