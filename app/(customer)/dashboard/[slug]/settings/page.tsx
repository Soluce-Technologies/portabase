import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageDescription, PageHeader, PageTitle} from "@/features/layout/page";
import {currentUser} from "@/lib/auth/current-user";
import {getOrganization} from "@/lib/auth/auth";
import {notFound} from "next/navigation";
import {requiredCurrentUser} from "@/auth/current-user";
import {SettingsTabs} from "@/components/wrappers/dashboard/settings/SettingsTabs/SettingsTabs";
import {getCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
import {
    DeleteOrganizationButton
} from "@/components/wrappers/dashboard/organization/DeleteOrganization/DeleteOrganizationButton";
import {EditButtonSettings} from "@/components/wrappers/dashboard/settings/EditButtonSettings/EditButtonSettings";


export default async function RoutePage(props: PageParams<{ slug: string }>) {
    const {slug: organizationSlug} = await props.params;

    const user = await currentUser();

    const organization = await getOrganization({organizationSlug});

    if (!organization || organization?.slug !== organizationSlug) {
        notFound();
    }



    // const organization = await prisma.organization.findUnique({
    //     where: {
    //         slug: currentOrganizationSlug,
    //     },
    //     include: {
    //         users:{
    //             include:{
    //                 user: {}
    //             }
    //         }
    //     }
    // })
    //
    // const currentOrganizationUser = await prisma.userOrganization.findFirst({
    //     where:{
    //         userId: user.id,
    //         organization:{
    //             slug: currentOrganizationSlug != "" ? currentOrganizationSlug : "default",
    //         }
    //     }
    // })
    // if (currentOrganizationUser.role != "admin") {
    //     notFound()
    // }
    //
    //
    // const settings = await prisma.settings.findUnique({
    //     where: {
    //         name: "system"
    //     }
    // })

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
                {/*<SettingsTabs settings={settings} currentUser={user} users={organization.users}/>*/}
            </PageContent>
        </Page>
    )
}