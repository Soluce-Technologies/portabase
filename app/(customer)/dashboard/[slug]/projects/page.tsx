import Link from 'next/link'

import {PageParams} from "@/types/next";
import {prisma} from "@/prisma";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {Button} from "@/components/ui/button";
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {ProjectCard} from "@/components/wrappers/dashboard/projects/ProjectCard/ProjectCard";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {notFound} from "next/navigation";


export default async function RoutePage(props: PageParams<{slug: string}>) {
    const {slug: organizationSlug} = await props.params


    const currentOrganizationSlug = await getCurrentOrganizationSlug()

    // if(currentOrganizationSlug != organizationSlug) {
    //     notFound()
    // }

    const projects = await prisma.project.findMany({
        where: {
            isArchived: {not: true},

            organization: {
                slug: organizationSlug,
                // users: {
                //     some: {
                //         userId: user.id
                //     },
                // },
            }
        },
        include: {
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
                        <Link href={`/dashboard/${currentOrganizationSlug}/projects/new`}>
                            <Button>+ Create Project</Button>
                        </Link>
                    </PageActions>
                )}

            </PageHeader>

            <PageContent className="mt-10">

                {projects.length > 0 ?
                    <CardsWithPagination
                        organizationSlug={currentOrganizationSlug}
                        data={projects}
                        cardItem={ProjectCard}
                        cardsPerPage={4}
                        numberOfColumns={1}
                    />
                    :
                    <Link
                        href={`/dashboard/${currentOrganizationSlug}/projects/new`}
                        className="  flex item-center justify-center border-2 border-dashed transition-colors border-primary p-8 lg:p-12 w-full rounded-md">
                        Create new Project
                    </Link>

                }
            </PageContent>
        </Page>
    )
}