import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"


export default async function RoutePage(props: PageParams<{}>) {
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
                                <TableRow>
                                    <TableCell>azertyuiop</TableCell>
                                    <TableCell><Badge variant="outline" className="text-orange-500 border-2 border-orange-500">ongoing</Badge></TableCell>
                                    <TableCell>28/01/25</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
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
                                <TableRow>
                                    <TableCell>azertyuiop</TableCell>
                                    <TableCell>ongoing</TableCell>
                                    <TableCell>28/01/25</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabsContent>

                </Tabs>
            </PageContent>
        </Page>
    )
}