"use client"

import {useEffect, useState} from "react";

import {ComboBox} from "@/components/wrappers/common/combobox";
import {Organization} from "@prisma/client";
import {getCurrentOrganizationId, setCurrentOrganizationId} from "@/features/dashboard/organization-cookie";
import {useSidebar} from "@/components/ui/sidebar";

export type organizationComboBoxProps = {
    organizations: Organization[]
    defaultOrganization: Organization
}


export function OrganizationCombobox(props: organizationComboBoxProps) {

    // const {organizationId, moveToAnotherOrganization} = useStore((state) => state);

    const [organizationId, setOrganizationId] = useState<string>()

    const {organizations, defaultOrganization} = props

    useEffect(() => {
        getCurrentOrganizationId().then(id => {

            if (id == "") {
                setOrganizationId(defaultOrganization.id)
                setCurrentOrganizationId(defaultOrganization.id)
            } else {
                setOrganizationId(id)
                const organization = organizations.find(organization => organization.id === id)
                if (!organization) {
                    setOrganizationId(defaultOrganization.id)
                    setCurrentOrganizationId(defaultOrganization.id)
                }
            }
        })

    }, [organizationId])

    const values = organizations.map(organization => {
        return ({
            value: organization.id,
            label: organization.name,
        })
    })

    const onValueChange = (id: string) => {
        if (organizationId !== id) {
            setOrganizationId(id)
            setCurrentOrganizationId(id)
        }
    }
    const {state, isMobile} = useSidebar();


    return (
        <>
            {state === 'expanded' && (
                <ComboBox
                    sideBar
                    values={values}
                    defaultValue={organizationId}
                    onValueChange={onValueChange}/>
            )}

        </>

    )
}