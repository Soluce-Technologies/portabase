import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {AgentForm} from "@/components/wrappers/Agent/AgentForm/AgentForm";


export default async function RoutePage(props: PageParams<{}>) {

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