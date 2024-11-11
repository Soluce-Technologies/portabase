import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {AgentCard} from "@/components/wrappers/Agent/AgentCard/AgentCard";
import {CardsWithPagination} from "@/components/wrappers/cards-with-pagination";
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
                <PageActions>
                    <Link href={"/dashboard/agents/new"}>
                        <Button>+ Create Agent</Button>
                    </Link>
                </PageActions>
            </PageHeader>

            <PageContent className="mt-10">
                <CardsWithPagination
                    data={agents}
                    cardItem={AgentCard}
                    cardsPerPage={4}
                    numberOfColumns={1}
                />
            </PageContent>
        </Page>
    )
}