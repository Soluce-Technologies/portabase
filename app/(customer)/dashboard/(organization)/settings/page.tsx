import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {currentUser} from "@/lib/auth/current-user";
import {getActiveMember, getOrganization} from "@/lib/auth/auth";
import {notFound} from "next/navigation";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/delete-organization/delete-organization-button";
import {EditButtonSettings} from "@/components/wrappers/dashboard/settings/edit-button-settings/edit-button-settings";
import {Metadata} from "next";
import {OrganizationTabs} from "@/components/wrappers/dashboard/organization/tabs/organization-tabs";
import {getOrganizationChannels} from "@/db/services/notification-channel";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function RoutePage(props: PageParams<{ slug: string }>) {
    const organization = await getOrganization({});
    const user = await currentUser();
    const activeMember = await getActiveMember()

    if (!organization) {
        notFound();
    }

    const notificationChannels = await getOrganizationChannels(organization.id)

    console.log("notificationChannels", notificationChannels);


    const isMember = activeMember?.role === "member";
    const isOwner = activeMember?.role === "owner";

    return (
        <Page>
            <PageHeader>
                <PageTitle className="flex items-center">
                    Organization settings
                    {!isMember && organization.slug !== "default" && (
                        <EditButtonSettings/>
                    )}
                </PageTitle>
                <PageActions>
                    {isOwner && organization.slug !== "default" && (
                        <DeleteOrganizationButton organizationSlug={organization.slug}/>
                    )}
                </PageActions>
            </PageHeader>
            <PageContent>
                <OrganizationTabs
                    organization={organization}
                    notificationChannels={notificationChannels}
                />
            </PageContent>
        </Page>
    )
}