import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {currentUser} from "@/lib/auth/current-user";
import {getOrganization} from "@/lib/auth/auth";
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

    if (!organization) {
        notFound();
    }


    console.log(organization);

    return (
        <Page>
            <PageHeader>
                <PageTitle className="flex items-center">
                    Organization settings
                    {organization.slug != "default" ?
                        <EditButtonSettings/>
                        : null}
                </PageTitle>
                <PageActions>
                    {organization.slug != "default" ?
                        <DeleteOrganizationButton organizationSlug={organization.slug}/>
                        : null}
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