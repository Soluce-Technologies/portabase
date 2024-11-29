import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";


export default async function RoutePage(props: PageParams<{}>) {

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Create new project
                </PageTitle>
            </PageHeader>
            <PageContent>

            </PageContent>
        </Page>
    )
}