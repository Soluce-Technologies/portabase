import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {currentUser} from "@/lib/auth/current-user";
import {getOrganization} from "@/lib/auth/auth";
import {notFound} from "next/navigation";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/DeleteOrganization/DeleteOrganizationButton";
import {EditButtonSettings} from "@/components/wrappers/dashboard/settings/EditButtonSettings/EditButtonSettings";


export default async function RoutePage(props: PageParams<{ slug: string }>) {
    const organization = await getOrganization({});
    const user = await currentUser();

    if (!organization) {
        notFound();
    }

    return (
        <Page>
            <PageHeader>
                <PageTitle className="flex items-center">
                    Settings
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
            <PageDescription>
                Manage your organization settings.
            </PageDescription>
            <PageContent>
            {/*    TODO add the list of organisation members (add, remove, edit) */}
            </PageContent>
        </Page>
    )
}