import {notFound} from "next/navigation";

import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {prisma} from "@/prisma";
import {ProjectForm} from "@/components/wrappers/dashboard/projects/ProjectsForm/ProjectForm";


export default async function RoutePage(props: PageParams<{
    projectId: string;
}>) {

    const {projectId} = await props.params

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            databases: {}
        }
    });

    if (!project) {
        notFound();
    }
    const organization = await prisma.organization.findFirst({
        where: {
            slug: 'default',
        }
    })
    const availableDatabases = await prisma.database.findMany({
        where: {
            OR: [
                {projectId: null},
                {projectId: project.id},
            ],
        },
        include: {
            agent: {}
        },
        orderBy: {
            createdAt: 'desc',
        },
    })


    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Edit {project.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <ProjectForm organization={organization} databases={availableDatabases} defaultValues={project}
                             projectId={project.id}/>
            </PageContent>
        </Page>
    )
}