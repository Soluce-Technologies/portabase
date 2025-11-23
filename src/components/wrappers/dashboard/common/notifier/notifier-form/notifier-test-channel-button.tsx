"use client"
import {Button} from "@/components/ui/button";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {useMutation} from "@tanstack/react-query";
import {dispatchNotification} from "@/features/notifications/dispatch";
import {EventPayload} from "@/features/notifications/types";
import {Send} from "lucide-react";
import {toast} from "sonner";

type NotifierTestChannelButtonProps = {
    notificationChannel: NotificationChannel;
}

export const NotifierTestChannelButton = ({notificationChannel}: NotifierTestChannelButtonProps) => {

    const mutation = useMutation({
        mutationFn: async () => {

            // const payload: EventPayload = {
            //     title: 'Database Down',
            //     message: 'Primary DB instance is unreachable',
            //     level: 'critical',
            //     data: {host: 'db-prod-01', error: 'connection timeout'},
            // };

            const payload: EventPayload = {
                title: 'Test Channel',
                message: `We are testing channel ${notificationChannel.name}`,
                level: 'info',
                // data: {host: 'db-prod-01', error: 'connection timeout'},
            };

            const result = await dispatchNotification(payload, undefined, notificationChannel.id);

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error("An error occurred while testing the notification channel");
            }
        },
    });


    return (
        <Button
            type="button"
            variant="default"
            onClick={() => mutation.mutateAsync()}
            disabled={mutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-all"
        >
            {mutation.isPending ? (
                <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>
                    Sending...
                </>
            ) : (
                <>
                    <Send className="mr-2 h-4 w-4"/>
                    Test Channel
                </>
            )}
        </Button>
    )
}