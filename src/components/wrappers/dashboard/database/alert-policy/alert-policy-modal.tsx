"use client"
import {Megaphone} from "lucide-react";

import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AlertPolicyForm} from "@/components/wrappers/dashboard/database/alert-policy/alert-policy-form";
import {DatabaseWith} from "@/db/schema/07_database";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";

type AlertPolicyModalProps = {
    database: DatabaseWith;
    notificationChannels: NotificationChannel[];
    organizationId: string;
}

export const AlertPolicyModal = ({database, notificationChannels, organizationId}: AlertPolicyModalProps) => {
    const [open, setOpen] = useState(false);

    const notificationsChannelsIds = notificationChannels.map(channel => channel.id);
    const activePolicies = database.alertPolicies?.filter((policy) => notificationsChannelsIds.some(()=> policy.notificationChannelId));
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)} className="relative">
                    <Megaphone/>
                    { activePolicies && activePolicies.length > 0 && (
                        <Badge
                            className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
                        >
                            {activePolicies.length}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alert policies</DialogTitle>
                    <DialogDescription>
                        Add and manage your database alert policies
                    </DialogDescription>

                    <Separator className="mt-3 mb-3"/>
                    <AlertPolicyForm
                        organizationId={organizationId}
                        notificationChannels={notificationChannels}
                        database={database}
                        onSuccess={() => setOpen(false)}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}