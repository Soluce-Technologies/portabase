import Link from "next/link";
import {GearIcon} from "@radix-ui/react-icons";
import {KeyRound} from "lucide-react";

import {prisma} from "@/prisma";
import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {formatDateLastContact} from "@/utils/date-formatting";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {AgentModalKey} from "@/components/wrappers/Agent/AgentModalKey/AgentModalKey";
import {CardsWithPagination} from "@/components/wrappers/cards-with-pagination";
import {DatabaseCard} from "@/components/wrappers/Dashboard/Projects/ProjectCard/ProjectDatabaseCard";


export default async function RoutePage(props: PageParams<{ agentId: string }>) {

    const {agentId} = await props.params

    const agent = await prisma.agent.findUnique({
        where: {
            id: agentId,
        },
        include: {
            databases: {}
        }
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
                            {formatDateLastContact(agent.lastContact)}
                        </CardContent>
                    </Card>
                </div>
                <CardsWithPagination data={agent.databases} cardItem={DatabaseCard}/>
            </PageContent>
        </Page>
    )
}