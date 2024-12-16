import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {notFound} from "next/navigation";
import {requiredCurrentUser} from "@/auth/current-user";
import {UserForm} from "@/components/wrappers/dashboard/profile/UserForm/UserForm";
import {prisma} from "@/prisma";
import {Badge} from "@/components/ui/badge";
import {ButtonDeleteAccount} from "@/components/wrappers/dashboard/profile/ButtonDeleteAccount/ButtonDeleteAccount";
import {AvatarWithUpload} from "@/components/wrappers/dashboard/profile/Avatar/AvatarWithUpload";

export default async function RoutePage(props: PageParams<{}>) {

    const user = await requiredCurrentUser()
    if (!user) {
        notFound()
    }
    const userInfo = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })
    return (
        <Page>
                <div className="justify-between gap-2 sm:flex">
                    <PageTitle className="flex items-center">
                        <AvatarWithUpload user={userInfo}/>
                        {user.name}
                        <Badge className="ml-3 hidden lg:block">{userInfo.authMethod}</Badge>
                        <Badge className="ml-3 hidden lg:block">{userInfo.role}</Badge>
                    </PageTitle>
                    <PageActions className="mt-2 hidden sm:block">
                        <ButtonDeleteAccount text="Delete my account"/>
                    </PageActions>
                </div>
            <PageContent>
                <UserForm  userId={userInfo.id} defaultValues={userInfo}/>
                <div className="mt-4 sm:hidden">
                    <ButtonDeleteAccount text="Delete my account" />
                </div>

            </PageContent>
        </Page>
    )
}