// import {OrganizationWithMembers} from "@/db/schema/03_organization";
// import {NotificationChannel} from "@/db/schema/09_notification-channel";
// import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
// import {NotifierCard} from "@/components/wrappers/dashboard/common/notifier/notifier-card/notifier-card";
// import {NotifierAddEditModal} from "@/components/wrappers/dashboard/common/notifier/notifier-add-edit-modal";
// import {EmptyStatePlaceholder} from "@/components/wrappers/common/empty-state-placeholder";
//
//
// export type OrganizationNotifiersTabProps = {
//     organization: OrganizationWithMembers;
//     notificationChannels: NotificationChannel[];
// };
//
// export const OrganizationNotifiersTab = ({organization, notificationChannels}: OrganizationNotifiersTabProps) => {
//
//     return (
//         <div className="flex flex-col gap-y-4 h-full  py-4">
//             <EmptyStatePlaceholder className="h-full" text="No project available"/>
//
//             <div className="flex flex-row gap-y-4 justify-between ">
//                 <div>
//                     <div className="flex items-center gap-3 mb-1">
//                         <h3 className="text-xl font-semibold text-balance">Notification Settings</h3>
//                     </div>
//                     <p className="text-muted-foreground leading-relaxed">
//                         Configure how and when you receive alerts about your services and infrastructure.
//                     </p>
//                 </div>
//                 <div>
//                     <NotifierAddEditModal organization={organization}/>
//                 </div>
//             </div>
//             <div className=" h-full">
//                 <CardsWithPagination data={notificationChannels} cardItem={NotifierCard} cardsPerPage={8}
//                                      numberOfColumns={2} organization={organization}/>
//             </div>
//         </div>
//     );
// };
import {OrganizationWithMembers} from "@/db/schema/03_organization";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {NotifierCard} from "@/components/wrappers/dashboard/common/notifier/notifier-card/notifier-card";
import {NotifierAddEditModal} from "@/components/wrappers/dashboard/common/notifier/notifier-add-edit-modal";
import {EmptyStatePlaceholder} from "@/components/wrappers/common/empty-state-placeholder";
import {useState} from "react";
import {cn} from "@/lib/utils";

export type OrganizationNotifiersTabProps = {
    organization: OrganizationWithMembers;
    notificationChannels: NotificationChannel[];
};

export const OrganizationNotifiersTab = ({
                                             organization,
                                             notificationChannels,
                                         }: OrganizationNotifiersTabProps) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const hasNotifiers = notificationChannels.length > 0;

    return (
        <div className="flex flex-col gap-y-6 h-full py-4">

            <div className="h-full flex flex-col gap-y-6">
                <div className={cn("hidden flex-row justify-between items-start", hasNotifiers && "flex")}>
                    <div className="max-w-2xl">
                        <h3 className="text-xl font-semibold text-balance mb-1">
                            Notification Settings
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Configure how and when you receive alerts about your services and
                            infrastructure.
                        </p>
                    </div>
                    <NotifierAddEditModal
                        organization={organization}
                        open={isAddModalOpen}
                        onOpenChangeAction={setIsAddModalOpen}
                    />
                </div>
                {hasNotifiers ? (
                    <div className="h-full">
                        <CardsWithPagination
                            data={notificationChannels}
                            cardItem={NotifierCard}
                            cardsPerPage={8}
                            numberOfColumns={2}
                            organization={organization}
                        />
                    </div>
                ) : (
                    <EmptyStatePlaceholder
                        text="No notification channels configured yet"
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-full"
                    />
                )}
            </div>
        </div>
    );
};