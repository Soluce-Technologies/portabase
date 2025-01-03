import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {buttonVariants} from "@/components/ui/button";
import {prisma} from "@/prisma";
import {GearIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {ButtonDeleteProject} from "@/components/wrappers/dashboard/projects/ButtonDeleteProject/ButtonDeleteProject";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {ProjectDatabaseCard} from "@/components/wrappers/dashboard/projects/ProjectCard/ProjectDatabaseCard";
import {notFound} from "next/navigation";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";


export default async function RoutePage(props: PageParams<{ slug:string, projectId: string }>) {

    const {slug: organizationSlug, projectId} = await props.params


    const currentOrganizationSlug = await getCurrentOrganizationSlug()

    if(currentOrganizationSlug != organizationSlug) {
        notFound()
    }



    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            isArchived: {not: true}
        },
        include:{
            databases: {}
        }
    })

    if(!project){
        notFound()
    }

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    {project.name}
                    <Link className={buttonVariants({variant: "outline"})}
                          href={`/dashboard/${currentOrganizationSlug}/projects/${project.id}/edit`}>
                        <GearIcon className="w-7 h-7"/>
                    </Link>
                </PageTitle>
                <PageActions className="justify-between">
                    <ButtonDeleteProject
                        projectId={projectId}
                        text={"Delete Project"}
                    />
                </PageActions>
            </div>
            <PageDescription>
                The list of associated databases
            </PageDescription>
            <PageContent className="flex flex-col w-full h-full">
                {project.databases.length > 0 ?
                    <CardsWithPagination
                        data={project.databases}
                        organizationSlug={organizationSlug}
                        cardItem={ProjectDatabaseCard}
                        cardsPerPage={4}
                        numberOfColumns={1}
                        extendedProps={project}
                    />
                    :
                    null
                }
            </PageContent>
        </Page>
    )
}