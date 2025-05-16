"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsEmailTab } from "@/components/wrappers/dashboard/admin/AdminEmailTab/SettingsEmailTab";
import { SettingsStorageTab } from "@/components/wrappers/dashboard/admin/AdminStorageTab/SettingsStorageTab";
import { AdminUsersTable } from "@/components/wrappers/dashboard/admin/admin-user-table";
import { Setting } from "@/db/schema";
import { User } from "@/db/schema/01_user";

export type AdminTabsProps = {
    users: User[];
    settings: Setting;
};

export const AdminTabs = (props: AdminTabsProps) => {
    const { users, settings } = props;

    return (
        <Tabs defaultValue="users">
            <TabsList className="w-full">
                <TabsTrigger className="w-full " value="users">
                    Users
                </TabsTrigger>
                <TabsTrigger className="w-full " value="email">
                    Email
                </TabsTrigger>
                <TabsTrigger className="w-full " value="storage">
                    Storage
                </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
                <AdminUsersTable users={users} />
            </TabsContent>
            <TabsContent value="email">
                <SettingsEmailTab settings={settings} />
            </TabsContent>
            <TabsContent value="storage">
                <SettingsStorageTab settings={settings} />
            </TabsContent>
        </Tabs>
    );
};
