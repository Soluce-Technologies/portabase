import { PageParams } from "@/types/next";
import * as drizzleDb from "@/db";

import { Page, PageContent, PageHeader, PageTitle } from "@/features/layout/page";
import { AdminTabs } from "@/components/wrappers/dashboard/admin/admin-tabs";
import { currentUser } from "@/lib/auth/current-user";
import { db } from "@/db";
import {eq, isNotNull, isNull} from "drizzle-orm";


export default async function RoutePage(props: PageParams<{}>) {
    const user = await currentUser();

    const users = await db.query.user.findMany({
        where: (fields) => isNull(fields.deletedAt)
    });
    // const users = await db.query.user.findMany();
    console.log("users",users);

    const settings = await db.query.setting.findFirst({
        where: (fields, { eq }) => eq(fields.name, "system"),
    });

    return (
        <Page>
            <PageHeader>
                <PageTitle>Administration Panel</PageTitle>
            </PageHeader>
            <PageContent className="mt-10">
                <AdminTabs settings={settings!} users={users} />
            </PageContent>
        </Page>
    );
}
