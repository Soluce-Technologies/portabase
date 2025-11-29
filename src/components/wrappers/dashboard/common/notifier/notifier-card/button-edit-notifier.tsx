"use client";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {NotifierAddEditModal} from "@/components/wrappers/dashboard/common/notifier/notifier-add-edit-modal";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {Switch} from "@/components/ui/switch";
import {
    updateNotificationChannelAction
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-form.action";
import {toast} from "sonner";
import {useState} from "react";
import {Organization, OrganizationWithMembers} from "@/db/schema/03_organization";

export type EditNotifierButtonProps = {
    notificationChannel: NotificationChannel;
    organization? : OrganizationWithMembers;
};

export const EditNotifierButton = ({notificationChannel, organization}: EditNotifierButtonProps) => {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    const mutation = useMutation({
        mutationFn: async (value: boolean) => {

            const payload = {
                data: {
                    name: notificationChannel.name,
                    provider: notificationChannel.provider,
                    config: notificationChannel.config as Record<string, any>,
                    enabled: value
                },
                notificationChannelId: notificationChannel.id
            };

            const result = await updateNotificationChannelAction(payload);
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
        <>
            <Switch checked={notificationChannel.enabled} onCheckedChange={async () => {
                await mutation.mutateAsync(!notificationChannel.enabled)
            }}
            />
            <NotifierAddEditModal
                organization={organization}
                notificationChannel={notificationChannel}
                open={isAddModalOpen}
                onOpenChangeAction={setIsAddModalOpen}
            />
        </>
    );
};
