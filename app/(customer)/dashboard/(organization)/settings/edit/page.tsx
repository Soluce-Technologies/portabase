import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {notFound} from "next/navigation";
import {OrganizationForm} from "@/components/wrappers/dashboard/organization/organization-form/organization-form";
import {getOrganization} from "@/lib/auth/auth";
import {db} from "@/db";
import {isNull} from "drizzle-orm";
import {currentUser} from "@/lib/auth/current-user";

export default async function RoutePage(props: PageParams<{

}>) {
    const user = await currentUser();

    const organization = await getOrganization({});

    const users = await db.query.user.findMany({
        where: (fields) => isNull(fields.deletedAt)
    });


    if (!user || !users || !organization || organization.slug == "default") {
        notFound();
    }

    return(
        <Page>
            <PageHeader>
                <PageTitle>
                    Edit {organization.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <OrganizationForm currentUser={user} users={users} defaultValues={organization}/>
            </PageContent>
        </Page>
    )
}