"use client"

import {useSession} from "next-auth/react";

import {ComboBox} from "@/components/wrappers/combobox";
import {Organization} from "@prisma/client";

export type organizationComboBoxProps = {
    organizations: Organization[]
    defaultOrganization: Organization
}


export function OrganizationComboBox(props: organizationComboBoxProps) {

    const {organizations, defaultOrganization} = props

    const values = organizations.map(organization => {
        return ({
            value: organization.id,
            label: organization.name,
        })
    })

    const {data: session, update} = useSession();

    const updateSession = async (organizationId: string) => {
        const organization = organizations.find(organization => organization.id === organizationId)
        await update({...session, organization: organization})
        console.log("session updtated", organization)
    }

    return (
        <ComboBox values={values} defaultValue={defaultOrganization.id} onValueChange={updateSession}/>
    )
}