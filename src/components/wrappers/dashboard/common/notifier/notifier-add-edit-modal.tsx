"use client"

import {Pencil, Plus} from "lucide-react";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {NotifierForm} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-form";
import {OrganizationWithMembers} from "@/db/schema/03_organization";
import {NotificationChannel} from "@/db/schema/09_notification-channel";

type OrganizationNotifierAddModalProps = {
    notificationChannel?: NotificationChannel
    organization?: OrganizationWithMembers;
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}


export const NotifierAddEditModal = ({
                                         organization,
                                         notificationChannel,
                                         open,
                                         onOpenChangeAction
                                     }: OrganizationNotifierAddModalProps) => {

    const isCreate = !Boolean(notificationChannel);

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogTrigger asChild>
                {isCreate ?
                    <Button>
                        <Plus/> Add notification channel
                    </Button>
                    :
                    <Button
                        variant="ghost"
                        size="icon"
                    >
                        <Pencil className="h-4 w-4"/>
                    </Button>
                }
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle> {isCreate ? "Add" : "Edit"} Notification Channel</DialogTitle>
                    <DialogDescription>
                        Configure your notification channel preferences and event triggers.
                    </DialogDescription>
                </DialogHeader>
                <NotifierForm
                    defaultValues={notificationChannel}
                    organization={organization}
                    onSuccessAction={() => onOpenChangeAction(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
