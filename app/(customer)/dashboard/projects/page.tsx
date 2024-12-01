import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {CardsWithPagination} from "@/components/wrappers/cards-with-pagination";
import {Button} from "@/components/ui/button";
import Link from 'next/link'
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {projects} from "@/utils/mock-data";
import {ProjectCard} from "@/components/wrappers/Dashboard/Projects/ProjectCard/ProjectCard";

export default async function RoutePage(props: PageParams<{}>) {


    const projects = await prisma.project.findMany({
        where: {
            organization: {
                slug: "default",
            }
        },
        include:{
            databases: {}
        }
    })

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    Projects
                </PageTitle>
                {projects.length > 0 && (
                    <PageActions>
                        <Link href={"/dashboard/projects/new"}>
                            <Button>+ Create Project</Button>
                        </Link>
                    </PageActions>
                )}

            </PageHeader>

            <PageContent className="mt-10">

                {projects.length > 0 ?
                    <CardsWithPagination
                        data={projects}
                        cardItem={ProjectCard}
                        cardsPerPage={4}
                        numberOfColumns={1}
                    />
                    :
                    <Link
                        href="/dashboard/projects/new"
                        className="  flex item-center justify-center border-2 border-dashed transition-colors border-primary p-8 lg:p-12 w-full rounded-md">
                        Create new Project
                    </Link>

                }
            </PageContent>
        </Page>
    )
}