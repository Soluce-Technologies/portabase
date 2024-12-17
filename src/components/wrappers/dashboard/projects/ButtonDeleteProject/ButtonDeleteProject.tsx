"use client"

import {Trash2} from "lucide-react";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";
import {useMutation} from "@tanstack/react-query";
import {deleteProjectAction} from "@/components/wrappers/dashboard/projects/ButtonDeleteProject/delete-project.action";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export type ButtonDeleteProjectProps = {
    text? : string
    projectId: string
}

export const ButtonDeleteProject = (props: ButtonDeleteProjectProps) => {
    const router = useRouter()
    const mutation = useMutation({
        mutationFn: () => deleteProjectAction(props.projectId),
        onSuccess: async (result) => {
            router.push("/dashboard/projects")
            if(result.data.success) {
                toast.success(result.data.actionSuccess.message);
            }
        },
    })

    return (
        <ButtonWithConfirm
            text={props.text ? props.text : ""}
            onClick={() => {
                mutation.mutate()
            }}
            variant={"destructive"}
            isPending={mutation.isPending}
            className="gap-2"
            icon={<Trash2/>}
        />
    )
}
