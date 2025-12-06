"use client"

import {Pencil, Plus} from "lucide-react";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {NotifierForm} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-form";
import {OrganizationWithMembers} from "@/db/schema/03_organization";
import {NotificationChannel, NotificationChannelWith} from "@/db/schema/09_notification-channel";
import {useIsMobile} from "@/hooks/use-mobile";
import {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    NotifierChannelOrganisationForm
} from "@/components/wrappers/dashboard/admin/notifications/channels/organization/notification-channels-organization-form";

type OrganizationNotifierAddModalProps = {
    notificationChannel?: NotificationChannelWith
    organization?: OrganizationWithMembers;
    open?: boolean;
    onOpenChangeAction?: (open: boolean) => void;
    adminView?: boolean;
    organizations?: OrganizationWithMembers[]
}


export const NotifierAddEditModal = ({
                                         organization,
                                         notificationChannel,
                                         open = false,
                                         onOpenChangeAction,
                                         adminView,
                                         organizations
                                     }: OrganizationNotifierAddModalProps) => {
    const isMobile = useIsMobile();
    const [openInternal, setOpen] = useState(open);

    const isCreate = !Boolean(notificationChannel);


    return (
        <Dialog open={openInternal} onOpenChange={(state) => {
            onOpenChangeAction?.(state);
            setOpen(state);
        }}>
            <DialogTrigger asChild>
                {isCreate ?
                    <Button>
                        <Plus/>{!isMobile && `Add notification channel`}
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


                <div>
                    {adminView ?

                        <Tabs className="flex flex-col flex-1" defaultValue="configuration">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                                <TabsTrigger value="organizations">Organizations</TabsTrigger>
                            </TabsList>
                            <TabsContent className="h-full justify-between" value="configuration">
                                <NotifierForm
                                    adminView={adminView}
                                    defaultValues={notificationChannel}
                                    organization={organization}
                                    onSuccessAction={() => {
                                        onOpenChangeAction?.(false)
                                        setOpen(false);
                                    }}
                                />
                            </TabsContent>
                            <TabsContent className="h-full justify-between" value="organizations">

                                <NotifierChannelOrganisationForm
                                    defaultValues={notificationChannel}
                                    organizations={organizations}
                                />


                            </TabsContent>
                        </Tabs>
                        :
                        <NotifierForm
                            adminView={adminView}
                            defaultValues={notificationChannel}
                            organization={organization}
                            onSuccessAction={() => {
                                onOpenChangeAction?.(false)
                                setOpen(false);
                            }}
                        />
                    }

                </div>


            </DialogContent>
        </Dialog>
    )
}
