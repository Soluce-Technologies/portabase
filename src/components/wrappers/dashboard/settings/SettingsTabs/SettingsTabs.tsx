"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataTableWithPagination} from "@/components/wrappers/common/table/data-table-with-pagination";
import {usersColumns} from "@/components/wrappers/dashboard/settings/SettingsUsersTab/columns-users";
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

        // <Tabs defaultValue="informations" >
        //     <TabsList className="w-full">
        //         <TabsTrigger className="w-full " value="informations">Info</TabsTrigger>
        //         <TabsTrigger className="w-full " value="users">Users</TabsTrigger>
        //         <TabsTrigger className="w-full " value="email">Email</TabsTrigger>
        //         <TabsTrigger className="w-full " value="storage">Storage</TabsTrigger>
        //     </TabsList>
        //     <TabsContent value="informations">
        //         <div className="flex flex-1 flex-col gap-4 py-4">
        //             <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        //                 <div className="aspect-video rounded-xl bg-muted/50"/>
        //                 <div className="aspect-video rounded-xl bg-muted/50"/>
        //                 <div className="aspect-video rounded-xl bg-muted/50"/>
        //             </div>
        //             <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
        //         </div>
        //     </TabsContent>
        //     <TabsContent value="users" >
        <SettingsUsersTab currentUser={currentUser} users={users}/>
        //     </TabsContent>
        //     <TabsContent value="email">
        //         <SettingsEmailTab settings={props.settings}/>
        //     </TabsContent>
        //     <TabsContent value="storage">
        //         <SettingsStorageTab settings={props.settings}/>
        //     </TabsContent>
        // </Tabs>

    )
}
