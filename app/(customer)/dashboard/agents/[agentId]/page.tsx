import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {StatusBadge} from "@/components/wrappers/status-badge";


export default async function RoutePage(props: PageParams<{}>) {

    const backups = [
        {'id': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'waiting'},
        {'id': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
        {'id': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
        {'id': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'ongoing'},
        {'id': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'waiting'},
        {'id': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
        {'id': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
        {'id': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'ongoing'},
        {'id': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'waiting'},
        {'id': 'backup-10', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'}
    ]

    const restores = [
        {'id': 'restore-1', 'backupId': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'waiting'},
        {'id': 'restore-2', 'backupId': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
        {'id': 'restore-3', 'backupId': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
        {'id': 'restore-4', 'backupId': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'ongoing'},
        {'id': 'restore-5', 'backupId': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'waiting'},
        {'id': 'restore-6', 'backupId': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
        {'id': 'restore-7', 'backupId': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
        {'id': 'restore-8', 'backupId': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'ongoing'},
        {'id': 'restore-9', 'backupId': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'waiting'},
        {'id': 'restore-10', 'backupId': 'backup-10', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'}
    ]

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Agent 1
                </PageTitle>
                <PageActions>
                    <Button>Backup</Button>
                    <Button>Restore</Button>
                </PageActions>
            </PageHeader>

            <PageDescription>My beautiful project!</PageDescription>

            <PageContent>
                <div className="flex flex-row sm:justify-between gap-6 mb-8">
                    <Card className="w-full">
                        <CardHeader>
                            Backups
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            Success rate
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            Last contact
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                </div>
                <Tabs defaultValue="backup">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="backup">Backup</TabsTrigger>
                        <TabsTrigger value="restore">Restore</TabsTrigger>
                    </TabsList>

                    <TabsContent className="flex flex-col gap-6" value="backup">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backups.map((backup) => (
                                    <TableRow>
                                        <TableCell>{backup.id}</TableCell>
                                        <TableCell>{backup.createdAt}</TableCell>
                                        <TableCell><StatusBadge status={backup.status}/></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent className="flex flex-col gap-6" value="restore">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Backup reference</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {restores.map((restore) => (
                                    <TableRow>
                                        <TableCell>{restore.backupId}</TableCell>
                                        <TableCell>{restore.createdAt}</TableCell>
                                        <TableCell><StatusBadge status={restore.status}/></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                </Tabs>
            </PageContent>
        </Page>
    )
}