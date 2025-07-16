import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {prisma} from "@/prisma";
import {requiredCurrentUser} from "@/auth/current-user";
import {notFound} from "next/navigation";
import {OrganizationForm} from "@/components/wrappers/dashboard/organization/OrganizationForm/OrganizationForm";
import {getOrganization} from "@/lib/auth/auth";


export default async function RoutePage(props: PageParams<{
    slug: string;
}>) {

    const {slug: organizationSlug} = await props.params;

    const organization = await getOrganization({organizationSlug});

    if (!organization) {
        notFound()
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