import {PageParams} from "@/types/next";
import {Page, PageActions, PageContent, PageHeader, PageTitle} from "@/features/layout/page";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {notFound} from "next/navigation";
import {requiredCurrentUser} from "@/auth/current-user";
import {UserForm} from "@/components/wrappers/Dashboard/Profile/UserForm/UserForm";
import {prisma} from "@/prisma";
import {Badge} from "@/components/ui/badge";

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

    console.log(userInfo)

    return (
        <Page>
            <PageHeader>
                <PageTitle className="flex items-center">
                    <Avatar className="size-14 mr-3">
                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                        {user.image ? (
                            <AvatarImage src={user.image} alt={`${user.name ?? "-"}'s profile picture`}/>
                        ) : null}
                    </Avatar>
                    {user.name}
                    <Badge className="ml-3">{userInfo.authMethod}</Badge>
                </PageTitle>
            </PageHeader>
            <PageContent>
                <UserForm userId={userInfo.id} defaultValues={userInfo} />
            </PageContent>
        </Page>
)
}