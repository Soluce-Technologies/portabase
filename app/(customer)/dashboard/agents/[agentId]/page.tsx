import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {backupColumns} from "@/features/backup/columns";
import {restoreColumns} from "@/features/restore/columns";
import {DataTableWithPagination} from "@/components/wrappers/table/data-table-with-pagination";
import {prisma} from "@/prisma";
import {GearIcon} from "@radix-ui/react-icons";
import Link from "next/link";


export default async function RoutePage(props: PageParams<{ agentId: string }>) {

    // const agent = await prisma.agent.findUnique({
    //     where: {
    //         id: props.params.agentId,
    //     },
    // })

    const agent = {
        "id": props.params.agentId,
        "name": "Agent 1",
        "description": "My beautiful project!",
        "lastContact": null,
    }

    const backups = [
        {'id': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'pending'},
        {'id': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
        {'id': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
        {'id': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'processing'},
        {'id': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'pending'},
        {'id': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
        {'id': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
        {'id': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'processing'},
        {'id': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'pending'},
        {'id': 'backup-10', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'},
        {'id': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'pending'},
        {'id': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
        {'id': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
        {'id': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'processing'},
        {'id': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'pending'},
        {'id': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
        {'id': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
        {'id': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'processing'},
        {'id': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'pending'},
        {'id': 'backup-11', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'}
    ]

    const restores = [
        {'id': 'restore-1', 'backupId': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'pending'},
        {'id': 'restore-2', 'backupId': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
        {'id': 'restore-3', 'backupId': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
        {'id': 'restore-4', 'backupId': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'processing'},
        {'id': 'restore-5', 'backupId': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'pending'},
        {'id': 'restore-6', 'backupId': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
        {'id': 'restore-7', 'backupId': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
        {'id': 'restore-8', 'backupId': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'processing'},
        {'id': 'restore-9', 'backupId': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'pending'},
        {'id': 'restore-10', 'backupId': 'backup-10', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'}
    ]

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
            <PageHeader>
                <PageTitle>
                    {agent.name}
                    <Link href={`/dashboard/agents/${agent.id}/edit`}>
                        <GearIcon className="w-7 h-7"/>
                    </Link>
                </PageTitle>

                <PageActions>
                    <Button>Backup</Button>
                    <Button>Restore</Button>
                </PageActions>
            </PageHeader>

            <PageDescription>{agent.description}</PageDescription>

            <PageContent className="flex flex-col w-full h-full">
                <div className="flex flex-row sm:justify-between gap-8 mb-6">
                    <Card className="w-full">
                        <CardHeader className="font-bold text-xl">
                            Backups
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader className="font-bold text-xl">
                            Success rate
                        </CardHeader>
                        <CardContent>
                            {successRate ?? "Unavailable for now."}
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader className="font-bold text-xl">
                            Last contact
                        </CardHeader>
                        <CardContent>
                            {agent.lastContact?.toDateString() ?? "Never connected"}
                        </CardContent>
                    </Card>
                </div>
                <Tabs className="flex flex-col flex-1" defaultValue="backup">

                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="backup">Backup</TabsTrigger>
                        <TabsTrigger value="restore">Backup</TabsTrigger>
                    </TabsList>

                    <TabsContent className="h-full justify-between" value="backup">
                        <DataTableWithPagination columns={backupColumns} data={backups}/>
                    </TabsContent>

                    <TabsContent className="h-full justify-between" value="restore">
                        <DataTableWithPagination columns={restoreColumns} data={restores}/>
                    </TabsContent>
                </Tabs>
            </PageContent>
        </Page>
    //     test
    )
}