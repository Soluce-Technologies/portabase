"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {SettingsEmailTab} from "@/components/wrappers/dashboard/admin/tabs/admin-email-tab/settings-email-tab";
import {SettingsStorageTab} from "@/components/wrappers/dashboard/admin/tabs/admin-storage-tab/settings-storage-tab";
import {User, UserWithAccounts} from "@/db/schema/02_user";
import {Setting} from "@/db/schema/01_setting";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {AdminUsersTable} from "@/components/wrappers/dashboard/admin/tabs/admin-user-tab/admin-user-table";
import {
    AdminOrganizationsTable
} from "@/components/wrappers/dashboard/admin/tabs/admin-organizations-tab/admin-organizations-table";
import {OrganizationWithMembers} from "@/db/schema/03_organization";

export type AdminTabsProps = {
    users: UserWithAccounts[];
    settings: Setting;
    organizations: OrganizationWithMembers[];
};

export const AdminTabs = ({users, settings, organizations}: AdminTabsProps) => {
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
                <TabsTrigger className="w-full" value="organizations">
                    Organizations
                </TabsTrigger>
                <TabsTrigger className="w-full" value="email">
                    Email
                </TabsTrigger>
                <TabsTrigger className="w-full" value="storage">
                    Storage
                </TabsTrigger>
            </TabsList>
            <TabsContent value="users">
                <AdminUsersTable users={users}/>
            </TabsContent>
            <TabsContent value="organizations">
                <AdminOrganizationsTable organizations={organizations}/>
            </TabsContent>
            <TabsContent value="email">
                <SettingsEmailTab settings={settings}/>
            </TabsContent>
            <TabsContent value="storage">
                <SettingsStorageTab settings={settings}/>
            </TabsContent>
        </Tabs>
    );
};
