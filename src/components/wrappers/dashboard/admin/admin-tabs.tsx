"use client"

import {User, Settings} from "@prisma/client";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {SettingsEmailTab} from "@/components/wrappers/dashboard/admin/AdminEmailTab/SettingsEmailTab";
import {SettingsStorageTab} from "@/components/wrappers/dashboard/admin/AdminStorageTab/SettingsStorageTab";
import {AdminUsersTable} from "@/components/wrappers/dashboard/admin/admin-user-table";


export type AdminTabsProps = {
    currentUser: User;
    users: User[];
    settings: Settings;
}

export const AdminTabs = (props: AdminTabsProps) => {

    const {currentUser, users, settings} = props;

    return (

        <Tabs defaultValue="users">

            <TabsList className="w-full">
                <TabsTrigger className="w-full " value="users">Users</TabsTrigger>
                <TabsTrigger className="w-full " value="email">Email</TabsTrigger>
                <TabsTrigger className="w-full " value="storage">Storage</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
                <AdminUsersTable currentUser={currentUser} users={users}/>
            </TabsContent>
            <TabsContent value="email">
                <SettingsEmailTab settings={settings}/>
            </TabsContent>
            <TabsContent value="storage">
                <SettingsStorageTab settings={settings}/>
            </TabsContent>
        </Tabs>

    )
}
