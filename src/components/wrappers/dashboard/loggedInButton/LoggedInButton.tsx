import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {currentUser} from "@/auth/current-user";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {ChevronUp} from "lucide-react";
import {LoggedInDropdown} from "@/components/wrappers/dashboard/loggedInDropdown/LoggedInDropdown";

export const LoggedInButton = async () => {

    const user = await currentUser()
    // if (!user) {
    //     return <SignInButton/>
    // }



    return (
        <LoggedInDropdown user={user}>
            <SidebarMenuButton>
                <Avatar className="size-6">
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    {user.image ? (
                        <AvatarImage src={user.image} alt={`${user.name ?? "-"}'s profile picture`}/>
                    ) : null}
                </Avatar>
                <span>{user.name}</span>
                <ChevronUp className="ml-auto"/>
            </SidebarMenuButton>
        </LoggedInDropdown>
    )
}
