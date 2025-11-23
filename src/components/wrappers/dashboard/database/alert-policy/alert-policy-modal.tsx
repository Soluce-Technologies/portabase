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
import {Database} from "@/db/schema/07_database";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {Separator} from "@/components/ui/separator";

type AlertPolicyModalProps = {
    database: Database;
    notificationChannels: NotificationChannel[];
    organizationId: string;
}

export const AlertPolicyModal = ({database, notificationChannels, organizationId}: AlertPolicyModalProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Megaphone/>
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