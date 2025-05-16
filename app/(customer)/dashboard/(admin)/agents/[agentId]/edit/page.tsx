import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { AgentForm } from "@/components/wrappers/dashboard/agent/AgentForm/AgentForm";
import { notFound } from "next/navigation";
import { db } from "@/db";

export default async function RoutePage(
    props: PageParams<{
        agentId: string;
    }>
) {
    const { agentId } = await props.params;

    const agent = await db.query.agent.findFirst({
        where: (fields, { eq }) => eq(fields.id, agentId),
    });

    if (!agent) {
        notFound();
    }

    return (
        <Page>
            <PageHeader>
                <PageTitle>Edit {agent.name}</PageTitle>
            </PageHeader>
            <PageContent>
                <AgentForm defaultValues={agent} agentId={agent.id} />
            </PageContent>
        </Page>
    );
}
