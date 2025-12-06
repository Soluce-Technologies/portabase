import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {Metadata} from "next";
import {
    NotificationChannelsSection
} from "@/components/wrappers/dashboard/admin/notifications/channels/notification-channels-section";
import {db} from "@/db";
import {notificationChannel, NotificationChannel, NotificationChannelWith} from "@/db/schema/09_notification-channel";
import {NotifierAddEditModal} from "@/components/wrappers/dashboard/common/notifier/notifier-add-edit-modal";
import {desc, isNull} from "drizzle-orm";

export const metadata: Metadata = {
    title: "Notification Channels",
};

export default async function RoutePage(props: PageParams<{}>) {

    const notificationChannels = await db.query.notificationChannel.findMany({
        with: {
            organizations: true
        },
        orderBy: desc(notificationChannel.createdAt)
    }) as NotificationChannelWith[]

    const organizations = await db.query.organization.findMany({
        where: (fields) => isNull(fields.deletedAt),
        with: {
            members: true,
        },
    });


    return (
        <Page>
            <PageHeader>
                <PageTitle>Notification channels</PageTitle>
                <PageActions>
                    <NotifierAddEditModal adminView={false}/>
                </PageActions>
            </PageHeader>
            <PageContent>
                <NotificationChannelsSection organizations={organizations} notificationChannels={notificationChannels}/>
            </PageContent>
        </Page>
    );
}
