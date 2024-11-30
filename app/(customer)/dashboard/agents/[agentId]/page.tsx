import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {Button, buttonVariants} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {backupColumns} from "@/features/backup/columns";
import {restoreColumns} from "@/features/restore/columns";
import {DataTableWithPagination} from "@/components/wrappers/table/data-table-with-pagination";
import {prisma} from "@/prisma";
import {GearIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {AgentModalKey} from "@/components/wrappers/Agent/AgentModalKey/AgentModalKey";
import {KeyRound} from "lucide-react";
import {BackupButton} from "@/components/wrappers/BackupButton/BackupButton";
import {backups, restaurations} from "@/utils/mock-data";


export default async function RoutePage(props: PageParams<{ agentId: string }>) {

    const {agentId} = await props.params

    const agent = await prisma.agent.findUnique({
        where: {
            id: agentId,
        },
    })

    const databaseId = 'db-123';

    const totalBackups = await prisma.backup.count({
        where: {
            databaseId: databaseId,
        },
    });

    const successfulBackups = await prisma.backup.count({
        where: {
            databaseId: databaseId,
            status: 'success',
        },
    });

    const successRate = totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : null


    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {agent.name}
                    <Link className={buttonVariants({variant: "outline"})}
                          href={`/dashboard/agents/${agent.id}/edit`}>
                        <GearIcon className="w-7 h-7"/>
                    </Link>
                    <AgentModalKey agent={agent}>
                        <Button variant="outline">
                            <KeyRound/>
                        </Button>
                    </AgentModalKey>
                </PageTitle>
                <PageActions className="justify-between">
                    <BackupButton/>
                    <Button>Restore</Button>
                </PageActions>
            </div>
            <PageDescription className="mt-5 sm:mt-0">{agent.description}</PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8 mb-6">
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Backups
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Success rate
                        </CardHeader>
                        <CardContent>
                            {successRate ?? "Unavailable for now."}
                        </CardContent>
                    </Card>
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Last contact
                        </CardHeader>
                        <CardContent>
                            {agent.lastContact?.toDateString() ?? "Never connected."}
                        </CardContent>
                    </Card>
                </div>
                <Tabs className="flex flex-col flex-1" defaultValue="backup">

                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="backup">Backup</TabsTrigger>
                        <TabsTrigger value="restore">Restoration</TabsTrigger>
                    </TabsList>

                    <TabsContent className="h-full justify-between" value="backup">
                        <DataTableWithPagination columns={backupColumns} data={backups}/>
                    </TabsContent>

                    <TabsContent className="h-full justify-between" value="restore">
                        <DataTableWithPagination columns={restoreColumns} data={restaurations}/>
                    </TabsContent>
                </Tabs>
            </PageContent>
        </Page>
    )
}