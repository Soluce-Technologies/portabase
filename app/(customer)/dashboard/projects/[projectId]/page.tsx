import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageTitle} from "@/features/layout/page";
import {buttonVariants} from "@/components/ui/button";

import {prisma} from "@/prisma";
import {GearIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {projects} from "@/utils/mock-data";


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

                </PageActions>
            </div>
            {/*<PageDescription className="mt-5 sm:mt-0">{Project.description}</PageDescription>*/}
            <PageContent className="flex flex-col w-full h-full">
            </PageContent>
        </Page>
    )
}