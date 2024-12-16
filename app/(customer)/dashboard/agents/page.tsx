import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {AgentCard} from "@/components/wrappers/dashboard/agent/AgentCard/AgentCard";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {Button} from "@/components/ui/button";
import Link from 'next/link'
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";


export default async function RoutePage(props: PageParams<{}>) {

    const agents = await prisma.agent.findMany({})

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Agents
                </PageTitle>
                {agents.length > 0 && (
                    <PageActions>
                        <Link href={"/dashboard/agents/new"}>
                            <Button>+ Create Agent</Button>
                        </Link>
                    </PageActions>
                )}
            </PageHeader>
            <PageContent className="mt-10">
                {agents.length > 0 ?
                    <CardsWithPagination
                        data={agents}
                        cardItem={AgentCard}
                        cardsPerPage={4}
                        numberOfColumns={1}
                    />
                    :
                    <Link
                        href="/dashboard/agents/new"
                        className="  flex item-center justify-center border-2 border-dashed transition-colors border-primary p-8 lg:p-12 w-full rounded-md">
                        Create new Agent
                    </Link>
                }
            </PageContent>
        </Page>
    )
}