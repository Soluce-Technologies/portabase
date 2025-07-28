import {PageParams} from "@/types/next";
import {Page, PageContent, PageTitle} from "@/features/layout/page";
import {notFound} from "next/navigation";
import {UserForm} from "@/components/wrappers/dashboard/profile/user-form/user-form";
import {Badge} from "@/components/ui/badge";
import {ButtonDeleteAccount} from "@/components/wrappers/dashboard/profile/button-delete-account/button-delete-account";
import {AvatarWithUpload} from "@/components/wrappers/dashboard/profile/avatar/avatar-with-upload";
import {currentUser} from "@/lib/auth/current-user";

export default async function RoutePage(props: PageParams<{}>) {
    const user = await currentUser();
    console.log("my user",user);
    if (!user) {
        return notFound();
    }

    if (user.role !== "user" && user.role !== "admin" && user.role !== "superadmin") {
        return notFound();
    }

    // const sessions = await getSessions();
    // const accounts = await getAccounts();

    return (
        <Page>
            <div className="justify-between gap-2 sm:flex">
                <PageTitle className="flex items-center">
                    <AvatarWithUpload
                        user={{
                            ...user,
                            image: user.image ?? null,
                            role: user.role ?? null,
                            banned: user.banned ?? null,
                            banReason: user.banReason ?? null,
                            banExpires: user.banExpires ?? null,
                            deletedAt: user.deletedAt ? new Date(user.deletedAt) : null,
                        }}
                    />
                    {user.name}
                    <Badge className="ml-3 hidden lg:block">{user.role}</Badge>
                </PageTitle>
                {/*<PageActions className="mt-2 hidden sm:block">*/}
                {/*    <ButtonDeleteAccount text="Delete my account"/>*/}
                {/*</PageActions>*/}
            </div>
            <PageContent>
                <UserForm
                    userId={user.id}
                    defaultValues={{
                        name: user.name,
                        email: user.email,
                        role: user.role ?? undefined,
                    }}
                />
                <div className="mt-4 sm:hidden">
                    <ButtonDeleteAccount text="Delete my account"/>
                </div>
            </PageContent>
        </Page>
    );
}
