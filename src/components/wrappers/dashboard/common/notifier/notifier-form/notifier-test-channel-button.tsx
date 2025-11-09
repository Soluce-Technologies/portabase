"use client"
import {Button} from "@/components/ui/button";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {useMutation} from "@tanstack/react-query";
import {dispatchNotification} from "@/features/notifications/dispatch";
import {EventPayload} from "@/features/notifications/types";

type NotifierTestChannelButtonProps = {
    notificationChannel: NotificationChannel;
}

export const NotifierTestChannelButton = ({notificationChannel}: NotifierTestChannelButtonProps) => {

    const mutation = useMutation({
        mutationFn: async () => {
            const payload: EventPayload = {
                title: 'Database Down',
                message: 'Primary DB instance is unreachable',
                level: 'critical',
                data: { host: 'db-prod-01', error: 'connection timeout' },
            };

            const result = await dispatchNotification(payload, undefined, notificationChannel.id);
            console.log(result);
        },
    });



    return (
        <Button
            type="button"

            onClick={async () => {
                await mutation.mutateAsync()
            }}

        >
            Test
        </Button>
    )
}