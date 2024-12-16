import {currentUser, requiredCurrentUser} from "@/auth/current-user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export type UserAvatarProps = {}

export const UserAvatar = async () => {

    const user = await currentUser()


    return (
        <div>
            <Avatar className="size-6">
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                {user.image ? (
                    <AvatarImage src={user.image} alt={`${user.name ?? "-"}'s profile picture`}/>
                ) : null}
            </Avatar>
        </div>
    )
}