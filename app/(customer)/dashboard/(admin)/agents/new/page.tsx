import { PageParams } from "@/types/next";
import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { AgentForm } from "@/components/wrappers/dashboard/agent/agent-form/agent-form";

export default async function RoutePage(props: PageParams<{}>) {
    return (
        <Page>
            <PageHeader>
                <PageTitle>Create new agent</PageTitle>
            </PageHeader>
            <PageContent>
                <AgentForm />
            </PageContent>
        </Page>
    );
}
