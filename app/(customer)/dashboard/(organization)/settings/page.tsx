import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {currentUser} from "@/lib/auth/current-user";
import {getActiveMember, getOrganization} from "@/lib/auth/auth";
import {notFound} from "next/navigation";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/delete-organization/delete-organization-button";
import {EditButtonSettings} from "@/components/wrappers/dashboard/settings/edit-button-settings/edit-button-settings";
import {
    SettingsOrganizationMembersTable
} from "@/components/wrappers/dashboard/settings/settings-organization-members-table";


export default async function RoutePage(props: PageParams<{ slug: string }>) {
    const organization = await getOrganization({});
    const user = await currentUser();
    const activeMember = await getActiveMember()


    if (!organization) {
        notFound();
    }

    const isMember = activeMember?.role === "member";

    if (isMember) {
        notFound();
    }


    return (
        <Page>
            <PageHeader>
                <PageTitle className="flex items-center">
                    Organization settings
                    {!isMember && organization.slug !== "default" && (
                        <EditButtonSettings />
                    )}
                </PageTitle>
                <PageActions>
                    {!isMember && organization.slug !== "default" && (
                        <DeleteOrganizationButton organizationSlug={organization.slug} />
                    )}
                </PageActions>
            </PageHeader>
            {/*<PageDescription>*/}
            {/*    Manage your organization settings.*/}
            {/*</PageDescription>*/}
            <PageContent>
                <SettingsOrganizationMembersTable organization={organization} />
            </PageContent>
        </Page>
    )
}