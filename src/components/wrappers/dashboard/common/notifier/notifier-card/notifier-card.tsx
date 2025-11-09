"use client";

import {Card} from "@/components/ui/card";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {Mail, MessageSquare, Pencil, Trash2, Webhook} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import {
    DeleteNotifierButton
} from "@/components/wrappers/dashboard/common/notifier/notifier-card/button-delete-notifier";
import {EditNotifierButton} from "@/components/wrappers/dashboard/common/notifier/notifier-card/button-edit-notifier";
import {Organization} from "@/db/schema/03_organization";

export type NotifierCardProps = {
    data: NotificationChannel;
    organization?: Organization;
};

export const NotifierCard = (props: NotifierCardProps) => {
    const {data, organization} = props;

    return (
        <div className="block transition-all duration-200 rounded-xl">
            <Card className="flex flex-row justify-between p-4">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary border border-border">
                        {getIcon(data.provider)}
                    </div>
                    <div className={`h-2 w-2 rounded-full ${data.enabled ? "bg-green-600" : "bg-muted"}`}/>
                </div>

                <div className="flex justify-start w-full">
                    <div className="flex flex-col items-start md:flex-row md:items-center gap-2 ">
                        <h3 className="font-medium text-foreground">{data.name}</h3>
                        <Badge variant="secondary" className="text-xs font-mono">
                            {data.provider}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <EditNotifierButton notificationChannel={data}/>
                    <DeleteNotifierButton
                        organizationId={organization?.id}
                        notificationChannelId={data.id}
                    />
                </div>
            </Card>
        </div>
    );
};


const getIcon = (type: string) => {
    const Icon = notificationTypes.find((t) => t.value === type)?.icon
    return Icon ? <Icon className="h-4 w-4"/> : null
}


const notificationTypes = [
    {value: "smtp", label: "Email", icon: Mail},
    {value: "slack", label: "Slack", icon: MessageSquare},
    {value: "webhook", label: "Webhook", icon: Webhook},
]