import { PageParams } from "@/types/next";
import { AgentCard } from "@/components/wrappers/dashboard/agent/agent-card/agent-card";
import { CardsWithPagination } from "@/components/wrappers/common/cards-with-pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Page, PageActions, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { notFound } from "next/navigation";
import { db } from "@/db";
import * as drizzleDb from "@/db";

import {and, eq, not} from "drizzle-orm";
import {Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {EmptyStatePlaceholder} from "@/components/wrappers/common/empty-state-placeholder";
export const dynamic = "force-dynamic";

export default async function RoutePage(props: PageParams<{}>) {

    const agents = await db.query.agent.findMany({
        where: not(eq(drizzleDb.schemas.agent.isArchived, true))
    });


    if (!agents) {
        notFound();
    }

    return (
        <Page>
            <PageHeader>
                <PageTitle>Agents</PageTitle>
                {agents.length > 0 && (
                    <PageActions>
                        <Link href={"/dashboard/agents/new"}>
                            <Button>+ Create Agent</Button>
                        </Link>
                    </PageActions>
                )}
            </PageHeader>
            <PageContent>
                {agents.length > 0 ? (
                    <CardsWithPagination data={agents} cardItem={AgentCard} cardsPerPage={4} numberOfColumns={1} />
                ) : (
                    <EmptyStatePlaceholder
                        url={"/dashboard/agents/new"}
                        text={"Create new Agent"}
                    />
                )}
            </PageContent>
        </Page>
    );
}
