"use client"

import {useEffect} from "react";

import {ComboBox} from "@/components/wrappers/combobox";
import {Organization} from "@prisma/client";
import {useStore} from "@/state-management/store";

export type organizationComboBoxProps = {
    organizations: Organization[]
    defaultOrganization: Organization
}


export function OrganizationComboBox(props: organizationComboBoxProps) {

    const {organizationId, moveToAnotherOrganization} = useStore((state) => state);

    const {organizations, defaultOrganization} = props

    useEffect(() => {
        if (organizationId == "") {
            moveToAnotherOrganization(defaultOrganization.id)
        } else {
            const organization = organizations.find(organization => organization.id === organizationId)
            if (!organization) moveToAnotherOrganization(defaultOrganization.id)
        }
    }, [organizationId])

    const values = organizations.map(organization => {
        return ({
            value: organization.id,
            label: organization.name,
        })
    })

    const onValueChange = async (id: string) => moveToAnotherOrganization(id)

    return (
        <ComboBox
            sideBar={true}
            values={values}
            defaultValue={organizationId}
            onValueChange={onValueChange}/>
    )
}