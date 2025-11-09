import {OrganizationWithMembers} from "@/db/schema/03_organization";
import {Bell} from "lucide-react";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {NotifierCard} from "@/components/wrappers/dashboard/common/notifier/notifier-card/notifier-card";
import {NotifierAddEditModal} from "@/components/wrappers/dashboard/common/notifier/notifier-add-edit-modal";


export type OrganizationNotifiersTabProps = {
    organization: OrganizationWithMembers;
    notificationChannels: NotificationChannel[];
};

export const OrganizationNotifiersTab = ({organization ,notificationChannels}: OrganizationNotifiersTabProps) => {


    return (
        <div className="flex flex-col gap-y-4 h-full py-4">
            <div className="flex flex-col gap-y-4 ">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border">
                            <Bell className="h-5 w-5 text-foreground"/>
                        </div>
                        <h1 className="text-3xl font-semibold text-balance">Notification Settings</h1>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        Configure how and when you receive alerts about your services and infrastructure.
                    </p>
                </div>
                <div>
                    <NotifierAddEditModal organization={organization}/>
                </div>
            </div>
            <div className=" h-full">
                <CardsWithPagination data={notificationChannels} cardItem={NotifierCard} cardsPerPage={8} numberOfColumns={2} organization={organization}/>
            </div>
        </div>
    );
};
