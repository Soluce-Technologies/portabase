import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";


export default async function RoutePage(props: PageParams<{}>) {

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Settings
                </PageTitle>
            </PageHeader>
            <PageContent>
                content
            </PageContent>
        </Page>
    )
}