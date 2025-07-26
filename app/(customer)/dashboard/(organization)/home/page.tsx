import { PageParams } from "@/types/next";
import {Page, PageHeader, PageTitle} from "@/features/layout/page";

export default async function RoutePage(props: PageParams<{}>) {

    return (
        <Page>
            <PageHeader>
                <PageTitle>Dashboard</PageTitle>
            </PageHeader>
            <div className="flex flex-1 flex-col gap-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
            </div>
        </Page>

    );
}
