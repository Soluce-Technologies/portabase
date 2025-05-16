import { PageParams } from "@/types/next";

import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { AdminTabs } from "@/components/wrappers/dashboard/admin/admin-tabs";
import { currentUser } from "@/lib/auth/current-user";
import { db } from "@/db";

export default async function RoutePage(props: PageParams<{}>) {
    const user = await currentUser()!;

    const users = await db.query.user.findMany({
        where: (fields, { isNull, not }) => not(isNull(fields.deletedAt)),
    });

    const settings = await db.query.setting.findFirst({
        where: (fields, { eq }) => eq(fields.name, "system"),
    });

    return (
        <Page>
            <PageHeader>
                <PageTitle>Administration Panel</PageTitle>
            </PageHeader>
            <PageContent className="mt-10">
                <AdminTabs settings={settings!} currentUser={user} users={users} />
            </PageContent>
        </Page>
    );
}
