"use client";

import { Trash2 } from "lucide-react";
import { ButtonWithConfirm } from "@/components/wrappers/common/button/button-with-confirm";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {deleteAgentAction} from "@/components/wrappers/dashboard/agent/button-delete-agent/delete-agent.action";

export type ButtonDeleteAgentProps = {
    text?: string;
    agentId: string;
};

export const ButtonDeleteAgent = (props: ButtonDeleteAgentProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: () => deleteAgentAction(props.agentId),
        onSuccess: async (result: any) => {
            if (result.data?.success) {
                toast.success(result.data.actionSuccess.message);
                router.push("/dashboard/agents");
            } else {
                toast.error(result.data.actionError.message || "Unknown error occurred.");
            }
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
