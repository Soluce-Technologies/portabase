"use client"

import {Trash2} from "lucide-react";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";

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
