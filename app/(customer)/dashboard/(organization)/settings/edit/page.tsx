import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {notFound} from "next/navigation";
import {OrganizationForm} from "@/components/wrappers/dashboard/organization/OrganizationForm/OrganizationForm";
import {getOrganization} from "@/lib/auth/auth";

export default async function RoutePage(props: PageParams<{

}>) {
    const organization = await getOrganization({});

    if (!organization || organization.slug == "default") {
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
                <OrganizationForm members={organization.members} defaultValues={organization}/>
            </PageContent>
        </Page>
    )
}