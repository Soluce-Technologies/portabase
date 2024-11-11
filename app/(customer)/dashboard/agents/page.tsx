import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {AgentCard} from "@/components/wrappers/Agent/AgentCard/AgentCard";
import {CardsWithPagination} from "@/components/wrappers/cards-with-pagination";
import {Button} from "@/components/ui/button";
import Link from 'next/link'
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";

export default async function RoutePage(props: PageParams<{}>) {

    // const agents = await prisma.agent.findMany({})

    const agents = [
        {"id": "467911b6-1234-4321-8765-111111111111", "name": "My Agent 1", "lastContact": "null"},
        {"id": "15f03a2a-f81e-4339-bb3d-222222222222", "name": "My Agent 2", "lastContact": "null"},
        {"id": "2e9b6e1a-5678-9012-3456-333333333333", "name": "My Agent 3", "lastContact": "null"},
        {"id": "8c637541-1111-2222-3333-444444444444", "name": "My Agent 4", "lastContact": "null"},
        {"id": "9e02f789-5555-6666-7777-555555555555", "name": "My Agent 5", "lastContact": "null"},
        {"id": "1a2b3c4d-8888-9999-0000-666666666666", "name": "My Agent 6", "lastContact": "null"},
        {"id": "7d8e9f0g-3333-4444-5555-777777777777", "name": "My Agent 7", "lastContact": "null"},
        {"id": "3f4g5h6j-9999-0000-1111-888888888888", "name": "My Agent 8", "lastContact": "null"},
        {"id": "5c6d7e8f-2222-3333-4444-999999999999", "name": "My Agent 9", "lastContact": "null"},
        {"id": "9a0b1c2d-6666-7777-8888-000000000000", "name": "My Agent 10", "lastContact": "null"}
    ]

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