import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {db} from "@/db";
import {DataTable} from "@/components/wrappers/common/table/data-table";
import {usersColumnsAdmin} from "@/components/wrappers/dashboard/admin/users/columns-users";
import {isNull} from "drizzle-orm";

export default async function RoutePage(props: PageParams<{}>) {

    const users = await db.query.user.findMany({
        where: (fields) => isNull(fields.deletedAt),
        with: {
            accounts: true
        }
    });

    return (
        <Page>
            <PageHeader className="flex flex-col">
                <div className="flex justify-between">
                    <PageTitle className="mb-3">Active users</PageTitle>
                </div>
            </PageHeader>
            <PageContent className="flex flex-col gap-5">
                <DataTable
                    enableSelect={false}
                    columns={usersColumnsAdmin}
                    data={users}/>
            </PageContent>
        </Page>
    );
}
