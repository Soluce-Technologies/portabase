import Link from "next/link";
import {GearIcon} from "@radix-ui/react-icons";
import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {formatDateLastContact} from "@/utils/date-formatting";
import {buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {DatabaseCard} from "@/components/wrappers/dashboard/projects/project-card/project-database-card";
import {AgentCardKey} from "@/components/wrappers/dashboard/agent/agent-card-key/agent-card-key";
import { db } from "@/db";
import * as drizzleDb from "@/db";
import {and, eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import {
    ButtonDeleteProject
} from "@/components/wrappers/dashboard/projects/button-delete-project/button-delete-project";
import {ButtonDeleteAgent} from "@/components/wrappers/dashboard/agent/button-delete-agent/button-delete-agent";


export default async function RoutePage(props: PageParams<{ agentId: string }>) {

    const {agentId} = await props.params

    const agent = await db.query.agent.findFirst({
        where: eq(drizzleDb.schemas.agent.id, agentId),
        with: {
            databases: true
        }
    })



    if (!agent) {
        notFound()
    }
    //
    // const databaseId = 'db-123';
    //

    console.log("agent",agent)





    // const totalBackupsResult = await db
    //     .select({ count: drizzleDb.schemas.backup.id })
    //     .from(drizzleDb.schemas.backup)
    //     .where(eq(drizzleDb.schemas.backup.databaseId, databaseId))
    //     .execute();
    //
    // const totalBackups = totalBackupsResult.length;
    //
    // const successfulBackupsResult = await db
    //     .select({ count: drizzleDb.schemas.backup.id })
    //     .from(drizzleDb.schemas.backup)
    //     .where(
    //         and(
    //             eq(drizzleDb.schemas.backup.databaseId, databaseId),
    //             eq(drizzleDb.schemas.backup.status, "success")
    //         )
    //     )
    //     .execute();
    //
    //
    // const successfulBackups = successfulBackupsResult.length;
    //
    // const successRate =
    //     totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : null;

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {agent.name}
                    <Link className={buttonVariants({variant: "outline"})}
                          href={`/dashboard/agents/${agent.id}/edit`}>
                        <GearIcon className="w-7 h-7"/>
                    </Link>
                </PageTitle>
                <PageActions className="justify-between">
                    <ButtonDeleteAgent agentId={agentId} text={"Delete Agent"} />
                </PageActions>
            </div>
            <PageDescription className="mt-5 sm:mt-0">{agent.description}</PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8 mb-6">
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Databases
                        </CardHeader>
                        <CardContent>{agent.databases.length}</CardContent>
                    </Card>
                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="font-bold text-xl">
                            Success rate
                        </CardHeader>
                        <CardContent>
                            {/*{successRate ?? "Unavailable for now."}*/}
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
                <Card className="w-full sm:w-auto flex-1 mb-4">
                    <CardHeader className="font-bold text-xl">
                        Edge Key
                    </CardHeader>
                    <CardContent>
                        <AgentCardKey agent={agent}/>
                    </CardContent>
                </Card>
                <CardsWithPagination cardsPerPage={2} data={agent.databases} cardItem={DatabaseCard}/>
            </PageContent>
        </Page>
    )
}