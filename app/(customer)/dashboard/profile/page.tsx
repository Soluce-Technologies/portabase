import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {notFound} from "next/navigation";
import {requiredCurrentUser} from "@/auth/current-user";
import {UserForm} from "@/components/wrappers/Dashboard/Profile/UserForm/UserForm";
import {prisma} from "@/prisma";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ButtonWithConfirm} from "@/components/wrappers/Button/ButtonWithConfirm/ButtonWithConfirm";
import {ButtonDeleteAccount} from "@/components/wrappers/Dashboard/Profile/ButtonDeleteAccount/ButtonDeleteAccount";
import {useIsMobile} from "@/hooks/use-mobile";
import {AvatarWithUpload} from "@/components/wrappers/Dashboard/Profile/Avatar/AvatarWithUpload";

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
                    </PageTitle>
                    <PageActions className={"mt-2"}>
                        <ButtonDeleteAccount/>
                    </PageActions>
                </div>
            <PageContent>
                <UserForm userId={userInfo.id} defaultValues={userInfo}/>
            </PageContent>
        </Page>
    )
}