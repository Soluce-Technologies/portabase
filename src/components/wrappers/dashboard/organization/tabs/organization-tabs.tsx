"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {MemberWithUser, OrganizationWithMembers} from "@/db/schema/03_organization";
import {
    SettingsOrganizationMembersTable
} from "@/components/wrappers/dashboard/settings/settings-organization-members-table";
import {
    OrganizationNotifiersTab
} from "@/components/wrappers/dashboard/organization/tabs/organization-notifiers-tab/organization-notifiers-tab";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {useOrganizationPermissions} from "@/hooks/use-organization-permissions";

export type OrganizationTabsProps = {
    organization: OrganizationWithMembers;
    notificationChannels: NotificationChannel[];
    activeMember: MemberWithUser
};

export const OrganizationTabs = ({activeMember, organization, notificationChannels}: OrganizationTabsProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tab, setTab] = useState<string>(() => searchParams.get("tab") ?? "users");

    const {
        canManageUsers,
        canManageNotifications,
    } = useOrganizationPermissions(activeMember);


    useEffect(() => {
        const newTab = searchParams.get("tab") ?? "users";
        setTab(newTab);
    }, [searchParams]);

    const handleChangeTab = (value: string) => {
        router.push(`?tab=${value}`);
    };


    return (
        <div className="h-full">
            {canManageNotifications ?
                <Tabs className="h-full" value={tab} onValueChange={handleChangeTab}>
                    <TabsList className="w-full">
                        <TabsTrigger
                            className="w-full"
                            value="users"
                        >
                            Users
                        </TabsTrigger>

                        <TabsTrigger
                            className="w-full"
                            value="notifications"
                        >
                            Notifiers
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent className="h-full" value="users">
                        <SettingsOrganizationMembersTable organization={organization}/>
                    </TabsContent>
                    <TabsContent className="h-full" value="notifications">
                        <OrganizationNotifiersTab
                            organization={organization}
                            notificationChannels={notificationChannels}
                        />
                    </TabsContent>
                </Tabs>
                :
                <SettingsOrganizationMembersTable organization={organization}/>
            }


        </div>


    );
};
