import {notFound} from "next/navigation";

import {currentUser} from "@/auth/current-user";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {ModeToggle} from "@/features/theme/ModeToggle";
import {LoggedInButton} from "@/components/wrappers/dashboard/loggedInButton/LoggedInButton";

export const Header = async () => {
    const user = await currentUser()
    if (!user) {
        return notFound()
    }
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <SidebarTrigger className="-ml-1"/>
            <div className="flex items-center gap-2">
                <ModeToggle/>
                <LoggedInButton/>
            </div>
        </header>

    )
}
