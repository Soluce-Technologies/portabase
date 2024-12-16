import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {AgentForm} from "@/components/wrappers/dashboard/agent/AgentForm/AgentForm";
import {requiredCurrentUser} from "@/auth/current-user";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";


export default async function RoutePage(props: PageParams<{
    agentId: string;
}>) {

    const {agentId} = await props.params

    const user = await requiredCurrentUser()
    const agent = await prisma.agent.findUnique({
        where: {
            id: agentId,
        }
    });

    if (!agent) {
        notFound();
    }


    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Edit {agent.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <AgentForm defaultValues={agent} agentId={agent.id}/>
            </PageContent>
        </Page>
    )
}