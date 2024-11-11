import {PageParams} from "@/types/next";
import {Page, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {AgentForm} from "@/components/wrappers/Agent/AgentForm/AgentForm";
import {requiredCurrentUser} from "@/auth/current-user";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";


export default async function RoutePage(props: PageParams<{
    agentId: string;
}>) {
    const user = await requiredCurrentUser()
    const agent = await prisma.agent.findUnique({
        where: {
            id: props.params.agentId,
        }
    });

    if (!agent){
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