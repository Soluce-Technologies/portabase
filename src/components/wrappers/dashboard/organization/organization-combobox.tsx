"use client"

import {useEffect, useState} from "react";

import {ComboBox} from "@/components/wrappers/common/combobox";
import {Organization} from "@prisma/client";
import {
    getCurrentOrganizationSlug,
    setCurrentOrganizationSlug
} from "@/features/dashboard/organization-cookie";
import {useSidebar} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";

export type organizationComboBoxProps = {
    organizations: Organization[]
    defaultOrganization: Organization
}


export function OrganizationCombobox(props: organizationComboBoxProps) {
    const router = useRouter()
    // const {organizationId, moveToAnotherOrganization} = useStore((state) => state);

    const [organizationSlug, setOrganizationSlug] = useState<string>()

    const {organizations, defaultOrganization} = props

    useEffect(() => {
        getCurrentOrganizationSlug().then(slug => {

            if (slug == "") {
                setOrganizationSlug(defaultOrganization.id)
                setCurrentOrganizationSlug(defaultOrganization.slug)
            } else {
                setOrganizationSlug(slug)
                const organization = organizations.find(organization => organization.slug === slug)
                if (!organization) {
                    setOrganizationSlug(defaultOrganization.id)
                    setCurrentOrganizationSlug(defaultOrganization.slug)
                }
            }
        })

    }, [organizationSlug])

    const values = organizations.map(organization => {
        return ({
            value: organization.slug,
            label: organization.name,
        })
    })

    const onValueChange = (slug: string) => {
        if (organizationSlug !== slug) {
            setOrganizationSlug(slug)
            setCurrentOrganizationSlug(slug)
            router.replace("/dashboard")
        }
    }
    const {state, isMobile} = useSidebar();


    return (
        <>
            {state === 'expanded' && (
                <ComboBox
                    sideBar
                    values={values}
                    defaultValue={organizationSlug}
                    onValueChange={onValueChange}/>
            )}

        </>

    )
}