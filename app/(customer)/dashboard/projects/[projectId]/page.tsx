import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {buttonVariants} from "@/components/ui/button";
import {prisma} from "@/prisma";
import {GearIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {ButtonDeleteProject} from "@/components/wrappers/dashboard/Projects/ButtonDeleteProject/ButtonDeleteProject";
import {CardsWithPagination} from "@/components/wrappers/cards-with-pagination";
import {ProjectDatabaseCard} from "@/components/wrappers/dashboard/Projects/ProjectCard/ProjectDatabaseCard";
import {notFound} from "next/navigation";


export default async function RoutePage(props: PageParams<{ projectId: string }>) {

    const {projectId} = await props.params

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
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
                          href={`/dashboard/projects/${project.id}/edit`}>
                        <GearIcon className="w-7 h-7"/>
                    </Link>
                </PageTitle>
                <PageActions className="justify-between">
                    <ButtonDeleteProject
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