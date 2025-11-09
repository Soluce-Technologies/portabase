"use client";
import {ButtonWithConfirm} from "@/components/wrappers/common/button/button-with-confirm";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {Trash2} from "lucide-react";
import {
    removeNotificationChannelAction,
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-form.action";
import {toast} from "sonner";

export type DeleteNotifierButtonProps = {
    notificationChannelId: string;
    organizationId?: string;
};

export const DeleteNotifierButton = ({notificationChannelId, organizationId}: DeleteNotifierButtonProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const result = await removeNotificationChannelAction({organizationId, notificationChannelId})
            const inner = result?.data;

            if (inner?.success) {
                toast.success(inner.actionSuccess?.message);
                router.refresh();
            } else {
                toast.error(inner?.actionError?.message);
            }
        },
    });

    return (
        <ButtonWithConfirm
            title="Delete Notifier"
            description="Are you sure you want to remove this notifier? This action cannot be undone."
            button={{
                main: {
                    size: "icon",
                    variant: "ghost",
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
