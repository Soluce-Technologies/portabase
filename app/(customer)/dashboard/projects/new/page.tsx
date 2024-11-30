import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {prisma} from "@/prisma";
import {ProjectForm} from "@/components/wrappers/Project/ProjectForm";


export default async function RoutePage(props: PageParams<{}>) {

    const availableDatabases = await prisma.database.findMany({
        where: {
            projectId: null
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const organization = await prisma.organization.findFirst({
        where: {
            slug: 'default',
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