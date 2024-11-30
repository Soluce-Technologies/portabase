import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {prisma} from "@/prisma";
import {ProjectForm} from "@/components/wrappers/project/ProjectForm";


export default async function RoutePage(props: PageParams<{}>) {

    const availableDatabases = await prisma.database.findMany({
        where: {
            projectId: null
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Create new project
                </PageTitle>
            </PageHeader>
            <PageContent>
                Add databases
                {availableDatabases.map(database =>
                    <div key={database.id}>
                        {database.name}
                    </div>)}
                <ProjectForm/>
            </PageContent>
        </Page>
    )
}