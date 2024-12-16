import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {prisma} from "@/prisma";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {EvolutionLineChart} from "@/components/wrappers/dashboard/statistics/charts/evolution-line-chart";
import {PercentageLineChart} from "@/components/wrappers/dashboard/statistics/charts/percentage-line-chart";

export default async function RoutePage(props: PageParams<{}>) {

    const projectsCount = await prisma.project.count({
        where: {
            organization: {
                slug: "default"
            }
        },
    });

    const backupsEvolution = await prisma.backup.findMany({
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const backupsRate = await prisma.backup.groupBy({
        by: ['createdAt', 'status'],
        where: {
            status: {
                in: ['success', 'failed'],
            },
        },
        _count: {
            id: true,
        },
    });


    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Statistics
                </PageTitle>
            </PageHeader>
            <PageContent className="flex flex-col gap-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {projectsCount}
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>KPI 2</CardTitle>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>KPI 3</CardTitle>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
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
    )
}