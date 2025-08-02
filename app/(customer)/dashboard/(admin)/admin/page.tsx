import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {AdminTabs} from "@/components/wrappers/dashboard/admin/admin-tabs";
import {db} from "@/db";
import {isNull} from "drizzle-orm";


export default async function RoutePage(props: PageParams<{}>) {

    const users = await db.query.user.findMany({
        where: (fields) => isNull(fields.deletedAt),
        with: {
            accounts: true
        }
    });

    const settings = await db.query.setting.findFirst({
        where: (fields, {eq}) => eq(fields.name, "system"),
    });

    return (
        <Page>
            <PageHeader>
                <PageTitle>Administration Panel</PageTitle>
            </PageHeader>
            <PageContent>
                <AdminTabs settings={settings!} users={users}/>
            </PageContent>
        </Page>
    );
}
