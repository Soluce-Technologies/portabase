"use client"
import {ButtonWithConfirm} from "@/components/wrappers/Button/ButtonWithConfirm/ButtonWithConfirm";
import {Trash2} from "lucide-react";

export type ButtonDeleteProjectProps = {
    text? : string
}

export const ButtonDeleteProject = (props: ButtonDeleteProjectProps) => {

    // const mutation = useMutation({
    //     mutationFn: () => deleteUserAction(""),
    //     onSuccess: async () => {
    //         await signOutAction();
    //     },
    // })

    return (
        <ButtonWithConfirm
            text={props.text ? props.text : ""}
            onClick={() => {
                // mutation.mutate()
                console.log("ok")
            }}
            variant={"destructive"}
            // isPending={mutation.isPending}
            className="gap-2"
            icon={<Trash2/>}
        />
    )
}
