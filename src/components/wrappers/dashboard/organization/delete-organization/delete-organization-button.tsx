"use client";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";
import {deleteOrganizationAction} from "@/components/wrappers/dashboard/organization/organization.action";
import {useMutation} from "@tanstack/react-query";
import {setCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {authClient} from "@/lib/auth/auth-client";
import {Trash2} from "lucide-react";

export type DeleteOrganizationButtonProps = {
    organizationSlug: string;
};

export const DeleteOrganizationButton = (props: DeleteOrganizationButtonProps) => {
    const router = useRouter();
    const {data: organizations, refetch} = authClient.useListOrganizations();

    const mutation = useMutation({
        mutationFn: () => deleteOrganizationAction(props.organizationSlug),

        onSuccess: async (result) => {
            if (result?.data?.success) {
                await authClient.organization.setActive({
                    organizationSlug: "default",
                });
                router.push("/");
                toast.success(result.data.actionSuccess?.message || "Organization deleted.");
                router.refresh()
                refetch()
            } else {
                // @ts-ignore
                const errorMsg = result?.data?.actionError?.message || result?.data?.actionError?.messageParams?.message || "Failed to delete the organization.";
                toast.error(errorMsg);
            }
        },

        onError: (error: any) => {
            console.error("Mutation network error:", error);
            toast.error(error?.message || "A network error occurred.");
        },
    });

    return (

        <ButtonWithConfirm
            title="Delete Organization"
            description="Are you sure you want to remove this organization? This action cannot be undone."
            button={{
                main: {
                    text: "Delete Organization",
                    variant: "outline",
                    icon: <Trash2 color="red"/>,
                },
                confirm: {
                    className: "w-full",
                    text: "Delete",
                    icon: <Trash2/>,
                    variant: "destructive",
                    onClick: () => {
                        mutation.mutate();
                    },
                },
                cancel: {
                    className: "w-full",
                    text: "Cancel",
                    icon: <Trash2/>,
                    variant: "outline",
                },
            }}
            isPending={mutation.isPending}
        />


    );
};
