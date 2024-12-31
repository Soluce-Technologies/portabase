import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {AgentForm} from "@/components/wrappers/dashboard/agent/AgentForm/AgentForm";
import {currentUser} from "@/auth/current-user";
import {notFound} from "next/navigation";


export default async function RoutePage(props: PageParams<{}>) {

    const user = await currentUser();

    if(user.role != "admin"){
        notFound()
    }

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Create new agent
                </PageTitle>
            </PageHeader>
            <PageContent>
                <AgentForm/>
            </PageContent>
        </Page>
    )
}