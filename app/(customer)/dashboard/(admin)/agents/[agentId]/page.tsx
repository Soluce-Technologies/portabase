import Link from "next/link";
import {GearIcon} from "@radix-ui/react-icons";
import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {formatDateLastContact} from "@/utils/date-formatting";
import {buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {DatabaseCard} from "@/components/wrappers/dashboard/projects/project-card/project-database-card";
import {AgentCardKey} from "@/components/wrappers/dashboard/agent/agent-card-key/agent-card-key";
import {db} from "@/db";
import * as drizzleDb from "@/db";
import {and, eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import {
    ButtonDeleteProject
} from "@/components/wrappers/dashboard/projects/button-delete-project/button-delete-project";
import {ButtonDeleteAgent} from "@/components/wrappers/dashboard/agent/button-delete-agent/button-delete-agent";
import {capitalizeFirstLetter} from "@/utils/text";
import {Server} from "lucide-react";
import {generateEdgeKey} from "@/utils/edge_key";
import {getServerUrl} from "@/utils/get-server-url";


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

    const edgeKey = await generateEdgeKey(getServerUrl(), agent.id);

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {capitalizeFirstLetter(agent.name)}
                    <Link className={buttonVariants({variant: "outline"})}
                          href={`/dashboard/agents/${agent.id}/edit`}>
                        <GearIcon className="w-7 h-7"/>
                    </Link>
                </PageTitle>
                <PageActions className="justify-between">
                    <ButtonDeleteAgent agentId={agentId} text={"Delete Agent"}/>
                </PageActions>
            </div>
            <PageDescription className="mt-5 sm:mt-0">{agent.description}</PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8 mb-6">

                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Databases</CardTitle>
                            <Server className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agent.databases.length}</div>
                            <p className="text-xs text-muted-foreground">Databases linked to this agent</p>
                        </CardContent>
                    </Card>

                    <Card className="w-full sm:w-auto flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last contact</CardTitle>
                            <Server className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatDateLastContact(agent.lastContact)}</div>
                            <p className="text-xs text-muted-foreground">Last contact with agent</p>
                        </CardContent>
                    </Card>

                </div>
                <Card className="w-full sm:w-auto flex-1 mb-4">
                    <CardHeader className="font-bold text-xl">
                        Edge Key
                    </CardHeader>
                    <CardContent>
                        <AgentCardKey
                            edgeKey={edgeKey}
                        />
                    </CardContent>
                </Card>
                <CardsWithPagination cardsPerPage={2} data={agent.databases} cardItem={DatabaseCard}/>
            </PageContent>
        </Page>
    )
}