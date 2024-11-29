import {PageParams} from "@/types/next";
import {Page, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {requiredCurrentUser} from "@/auth/current-user";
import {prisma} from "@/prisma";
import {notFound} from "next/navigation";
import {ProjectForm} from "@/components/wrappers/project/ProjectForm";


export default async function RoutePage(props: PageParams<{
    projectId: string;
}>) {

    const {projectId} = await props.params

    const user = await requiredCurrentUser()
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        }
    });

    if (!project) {
        notFound();
    }


    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Edit {project.name}
                </PageTitle>
            </PageHeader>
            <PageContent>
                <ProjectForm defaultValues={project} projectId={project.id}/>
            </PageContent>
        </Page>
    )
}