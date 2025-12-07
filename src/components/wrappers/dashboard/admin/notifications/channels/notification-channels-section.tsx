"use client"
import {NotificationChannel, NotificationChannelWith} from "@/db/schema/09_notification-channel";
import {CardsWithPagination} from "@/components/wrappers/common/cards-with-pagination";
import {NotifierCard} from "@/components/wrappers/dashboard/common/notifier/notifier-card/notifier-card";
import {useState} from "react";
import {EmptyStatePlaceholder} from "@/components/wrappers/common/empty-state-placeholder";
import {OrganizationWithMembers} from "@/db/schema/03_organization";
import {NotifierAddEditModal} from "@/components/wrappers/dashboard/common/notifier/notifier-add-edit-modal";

type NotificationChannelsSectionProps = {
    notificationChannels: NotificationChannelWith[]
    organizations: OrganizationWithMembers[]
}

export const NotificationChannelsSection = ({
                                                organizations,
                                                notificationChannels
                                            }: NotificationChannelsSectionProps) => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const hasNotifiers = notificationChannels.length > 0;

    return (
        <div className="h-full">
            <NotifierAddEditModal open={isAddModalOpen} onOpenChangeAction={setIsAddModalOpen} adminView={false} trigger={false}/>
            {hasNotifiers ? (
                <div className="h-full">

                    <CardsWithPagination
                        data={notificationChannels}
                        cardItem={NotifierCard}
                        cardsPerPage={8}
                        numberOfColumns={2}
                        adminView={true}
                        organizations={organizations}
                    />
                </div>
            ) : (
                <EmptyStatePlaceholder
                    text="No notification channels configured yet"
                    onClick={() => {
                        setIsAddModalOpen(true)
                    }}
                    className="h-full"
                />
            )}
        </div>
    );
}