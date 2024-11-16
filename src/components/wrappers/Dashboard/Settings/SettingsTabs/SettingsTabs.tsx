"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataTableWithPagination} from "@/components/wrappers/table/data-table-with-pagination";
import {usersColumns} from "@/components/wrappers/Dashboard/Settings/SettingsTabs/columns-users";
import {User} from "@prisma/client";
import {backupColumns} from "@/features/backup/columns";


export type SettingsTabsProps = {
    users: User[];
}

export const SettingsTabs = (props: SettingsTabsProps) => {




    return(
        <Tabs defaultValue="informations" >
            <TabsList className="w-full" >
                <TabsTrigger className="w-full" value="informations">Informations</TabsTrigger>
                <TabsTrigger className="w-full" value="users">Users</TabsTrigger>
                <TabsTrigger className="w-full" value="email">Email</TabsTrigger>
                <TabsTrigger className="w-full" value="storage">Storage</TabsTrigger>
            </TabsList>
            <TabsContent value="informations">
                ok
            </TabsContent>
            <TabsContent value="users" className="h-full justify-between">
                <DataTableWithPagination columns={usersColumns} data={props.users}/>
            </TabsContent>
            <TabsContent value="email">Change your password here.</TabsContent>
            <TabsContent value="storage">Change your password here.</TabsContent>
        </Tabs>
    )
}
