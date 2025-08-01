"use client";

import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { ButtonWithConfirm } from "@/components/wrappers/common/button/button-with-confirm";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { deleteUserAction } from "./delete-account.action";

export type ButtonDeleteAccountProps = {
    text?: string;
};

export const ButtonDeleteAccount = (props: ButtonDeleteAccountProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: () => deleteUserAction(""),
        onSuccess: async () => {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login");
                    },
                },
            });
        },
    });

    return (
        <ButtonWithConfirm
            text={props.text ? props.text : ""}
            onClick={() => {
                mutation.mutate();
            }}
            variant={"destructive"}
            isPending={mutation.isPending}
            className="gap-2"
            icon={<Trash2 />}
        />
    );
};
