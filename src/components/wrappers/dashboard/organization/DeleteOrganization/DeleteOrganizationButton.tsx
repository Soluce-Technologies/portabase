"use client"
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";
import {
    deleteOrganizationAction,
} from "@/components/wrappers/dashboard/organization/organization.action";
import {useMutation} from "@tanstack/react-query";
import {setCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {useRouter} from "next/navigation";

export type DeleteOrganizationButtonProps = {
    organizationSlug: string;
}

export const DeleteOrganizationButton = (props: DeleteOrganizationButtonProps) => {
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: () => deleteOrganizationAction(props.organizationSlug),
        onSuccess: async (result) => {
            console.log(result);
            if(result.data.success) {
                await setCurrentOrganizationSlug("default")
                router.push("/dashboard")
            }
        },
    })



    return(
        <ButtonWithConfirm
            onClick={() => {
                mutation.mutate()
            }}
            isPending={mutation.isPending}
            text="Delete Organization"
            variant="destructive"/>
    )
}