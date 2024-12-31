"use client"

import {User, Settings, UserOrganization} from "@prisma/client";
import {SettingsUsersTab} from "@/components/wrappers/dashboard/settings/SettingsUsersTab/SettingsUsersTab";


export type SettingsTabsProps = {
    currentUser: User;
    users: UserOrganization[];
    settings: Settings;
}

export const SettingsTabs = (props: SettingsTabsProps) => {

    const {currentUser, users} = props;

    return (
        <SettingsUsersTab currentUser={currentUser} users={users}/>
    )
}
