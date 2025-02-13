import React from "react";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {notFound, redirect} from "next/navigation";


export default async function Layout({children, params}: { children: React.ReactNode , params: { slug: string };}) {
    const {slug: organizationSlug} = await params
    console.log(organizationSlug);
    const currentOrganizationSlug = await getCurrentOrganizationSlug()
    console.log(currentOrganizationSlug);
    if(currentOrganizationSlug != organizationSlug) {
        redirect("charles")
    }

    return (
        <>
            {children}
        </>
    )
}