import {PageParams} from "@/types/next";
import {redirect} from "next/navigation";
import {getCurrentOrganizationSlug, setCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";

export default async function RoutePage(props: PageParams<{}>) {

    const currentOrganizationSlug = await getCurrentOrganizationSlug()
    if (currentOrganizationSlug == "") {
        redirect(`/dashboard/default/projects`)
    }
    redirect(`/dashboard/${currentOrganizationSlug}/projects`)
}