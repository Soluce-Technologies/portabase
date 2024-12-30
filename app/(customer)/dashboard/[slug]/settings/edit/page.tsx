import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {prisma} from "@/prisma";
import {requiredCurrentUser} from "@/auth/current-user";
import {notFound} from "next/navigation";
import {OrganizationForm} from "@/components/wrappers/dashboard/organization/OrganizationForm/OrganizationForm";


export default async function RoutePage(props: PageParams<{
    slug: string;
}>) {
    const {slug: organizationSlug} = await props.params
    const currentOrganizationSlug = await getCurrentOrganizationSlug()

    if(currentOrganizationSlug != organizationSlug) {
        notFound()
    }

    const organization = await prisma.organization.findUnique({
        where:{
            slug: currentOrganizationSlug,
        },
        include:{
            users:{
                include:{
                    user:{}
                }
            }
        }
    })

    const users = await prisma.user.findMany({
        where: {
            deleted: {not: true},
        }
    })



    return(
        <Page>
            <PageHeader>
                <PageTitle>
                    Edit {organization.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <OrganizationForm users={users} defaultValues={organization}/>
            </PageContent>
        </Page>
    )
}