"use client"
import {useMutation} from "@tanstack/react-query";
import {signOutAction} from "@/features/auth/auth.action";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/ButtonWithConfirm/ButtonWithConfirm";
import {deleteUserAction} from "@/components/wrappers/dashboard/profile/ButtonDeleteAccount/delete-account.action";
import {Trash2} from "lucide-react";

export type ButtonDeleteAccountProps = {
    text? : string
}

export const ButtonDeleteAccount = (props: ButtonDeleteAccountProps) => {

    const mutation = useMutation({
        mutationFn: () => deleteUserAction(""),
        onSuccess: async () => {
            await signOutAction();
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
