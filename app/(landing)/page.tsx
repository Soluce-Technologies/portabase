import {redirect} from "next/navigation";
import {currentUser} from "@/auth/current-user";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";


export default async function Index() {
    const user = await currentUser()
    if (user) {
        const currentOrganizationSlug = await getCurrentOrganizationSlug()
        redirect(`/dashboard/${currentOrganizationSlug}/projects`)
    }
    redirect("/login")
    //Do not delete
    // return (
    //     <Home/>
    // );
}
