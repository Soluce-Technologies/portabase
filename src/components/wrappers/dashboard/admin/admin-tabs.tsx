"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsEmailTab } from "@/components/wrappers/dashboard/admin/AdminEmailTab/SettingsEmailTab";
import { SettingsStorageTab } from "@/components/wrappers/dashboard/admin/AdminStorageTab/SettingsStorageTab";
import { AdminUsersTable } from "@/components/wrappers/dashboard/admin/admin-user-table";
import { User } from "@/db/schema/01_user";
import { Setting } from "@/db/schema/00_setting";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type AdminTabsProps = {
    users: User[];
    settings: Setting;
};

export const AdminTabs = ({ users, settings }: AdminTabsProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tab, setTab] = useState<string>(() => searchParams.get("tab") ?? "users");

    useEffect(() => {
        const newTab = searchParams.get("tab") ?? "users";
        setTab(newTab);
    }, [searchParams]);

    const handleChangeTab = (value: string) => {
        router.push(`?tab=${value}`);
    };

    return (
        <Tabs className="h-full" value={tab} onValueChange={handleChangeTab}>
            <TabsList className="w-full">
                <TabsTrigger className="w-full" value="users">
                    Users
                </TabsTrigger>
                <TabsTrigger className="w-full" value="email">
                    Email
                </TabsTrigger>
                <TabsTrigger className="w-full" value="storage">
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
