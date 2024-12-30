import {PageParams} from "@/types/next";
import {redirect} from "next/navigation";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";

export default async function RoutePage(props: PageParams<{}>) {

    const currentOrganizationSlug = await getCurrentOrganizationSlug()
    redirect(`/dashboard/${currentOrganizationSlug}/projects`)
}