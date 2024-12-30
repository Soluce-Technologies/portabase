"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataTableWithPagination} from "@/components/wrappers/common/table/data-table-with-pagination";
import {usersColumns} from "@/components/wrappers/dashboard/settings/SettingsUsersTab/columns-users-settings";
import {User, Settings} from "@prisma/client";
import {backupColumns} from "@/features/backup/columns";
import {SettingsEmailTab} from "@/components/wrappers/dashboard/admin/AdminEmailTab/SettingsEmailTab";
import {SettingsStorageTab} from "@/components/wrappers/dashboard/admin/AdminStorageTab/SettingsStorageTab";
import {SettingsUsersTab} from "@/components/wrappers/dashboard/settings/SettingsUsersTab/SettingsUsersTab";


export type SettingsTabsProps = {
    currentUser: User;
    users: User[];
    settings: Settings;
}

export const SettingsTabs = (props: SettingsTabsProps) => {

    const {currentUser, users} = props;

    return (
        <SettingsUsersTab currentUser={currentUser} users={users}/>
    )
}
