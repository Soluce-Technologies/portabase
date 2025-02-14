import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {prisma} from "@/prisma";
import {ProjectForm} from "@/components/wrappers/dashboard/projects/ProjectsForm/ProjectForm";
import {notFound} from "next/navigation";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";


export default async function RoutePage(props: PageParams<{slug: string}>) {
    const {slug: organizationSlug} = await props.params

    const currentOrganizationSlug = await getCurrentOrganizationSlug()
    if(currentOrganizationSlug != organizationSlug) {
        notFound()
    }


    const availableDatabases = await prisma.database.findMany({
        where: {
            projectId: null
        },
        include: {
            agent: {}
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const organization = await prisma.organization.findFirst({
        where: {
            slug: currentOrganizationSlug,
        }
    })

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Create new project
                </PageTitle>
            </PageHeader>
            <PageContent>
                <ProjectForm databases={availableDatabases} organization={organization}/>
            </PageContent>
        </Page>
    )
}