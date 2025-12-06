"use client"
import {Eye} from "lucide-react";

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
import {Separator} from "@/components/ui/separator";
import {NotificationLogWithRelations} from "@/db/services/notification-log";

type NotificationLogModalProps = {
    notificationLog: NotificationLogWithRelations;
}

export const NotificationLogModal = ({notificationLog}: NotificationLogModalProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)} className="relative">
                    <Eye/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Notification details</DialogTitle>
                    <DialogDescription>
                        Details of the notification sent
                    </DialogDescription>
                    <Separator className="mt-3 mb-3"/>

                    <div className="space-y-2 mb-4">
                        <div>
                            <span className="font-semibold">Title:</span>{" "}
                            <span>{notificationLog.content.title}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Message:</span>{" "}
                            <span>{notificationLog.content.message}</span>
                        </div>
                    </div>

                    {notificationLog.payload && (
                        <>
                            <Separator className="mb-3" />
                            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-4 rounded-md overflow-auto">
                                {JSON.stringify(notificationLog.payload, null, 2)}
                            </div>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}