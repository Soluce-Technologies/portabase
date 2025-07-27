import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronUp } from "lucide-react";
import { currentUser } from "@/lib/auth/current-user";
import {LoggedInDropdown} from "@/components/wrappers/dashboard/common/logged-in/logged-in-dropdown";

export const LoggedInButton = async () => {
    const user = await currentUser();

    if (!user) return null;

    return (
        <LoggedInDropdown
            user={{
                ...user,
                image: user.image ?? null,
                role: user.role ?? null,
                banned: user.banned ?? null,
                banReason: user.banReason ?? null,
                banExpires: user.banExpires ?? null,
                deletedAt: user.deletedAt ? new Date(user.deletedAt) : null,
            }}
        >
            <SidebarMenuButton>
                <Avatar className="size-6">
                    <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                    {user.image ? <AvatarImage src={user.image} alt={`${user.name ?? "-"}'s profile picture`} /> : null}
                </Avatar>
                <span className="first-letter:capitalize">{user.name}</span>
                <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
        </LoggedInDropdown>
    );
};
