import {Mail, MessageSquare, Webhook} from "lucide-react";

export const getNotificationChannelIcon = (type: string) => {
    const Icon = notificationTypes.find((t) => t.value === type)?.icon
    return Icon ? <Icon className="h-4 w-4"/> : null
}


const notificationTypes = [
    {value: "smtp", label: "Email", icon: Mail},
    {value: "slack", label: "Slack", icon: MessageSquare},
    {value: "webhook", label: "Webhook", icon: Webhook},
]