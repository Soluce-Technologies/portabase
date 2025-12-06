import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";

export default async function RoutePage(props: PageParams<{}>) {


    return (
        <Page>
            <PageHeader className="flex flex-col">
                <div className="flex justify-between">
                    <PageTitle className="mb-3">System storage</PageTitle>
                </div>
            </PageHeader>
            <PageContent className="flex flex-col gap-5">

            </PageContent>
        </Page>
    );
}
