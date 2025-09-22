"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {eventUpdate} from "@/types/events";
import {Backup, Database, DatabaseWith, Restoration} from "@/db/schema/07_database";
import {Setting} from "@/db/schema/01_setting";
import {DatabaseBackupList} from "@/components/wrappers/dashboard/projects/database/database-backup-list";
import {DatabaseRestoreList} from "@/components/wrappers/dashboard/projects/database/database-restore-list";

export type DatabaseTabsProps = {
    settings: Setting
    backups: Backup[];
    restorations: Restoration[];
    isAlreadyRestore: boolean;
    database: DatabaseWith;
};

export const DatabaseTabs = (props: DatabaseTabsProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tab, setTab] = useState<string>(() => searchParams.get("tab") ?? "backup");

    useEffect(() => {
        const eventSource = new EventSource("/api/events");
        eventSource.addEventListener("modification", (event) => {
            const data: eventUpdate = JSON.parse(event.data);
            if (data.update) {
                router.refresh();
            }
        });

        return () => {
            eventSource.close();
        };
    }, []);

    useEffect(() => {
        const newTab = searchParams.get("tab") ?? "backup";
        setTab(newTab);
    }, [searchParams]);

    const handleChangeTab = (value: string) => {
        router.push(`?tab=${value}`);
    };

    return (
        <Tabs className="flex flex-col flex-1" value={tab} onValueChange={handleChangeTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="backup">Backup</TabsTrigger>
                <TabsTrigger value="restore">Restoration</TabsTrigger>
            </TabsList>
            <TabsContent className="h-full justify-between" value="backup">
                <DatabaseBackupList
                    isAlreadyRestore={props.isAlreadyRestore}
                    settings={props.settings}
                    database={props.database}
                    backups={props.backups}
                />
            </TabsContent>
            <TabsContent className="h-full justify-between" value="restore">
                <DatabaseRestoreList
                    isAlreadyRestore={props.isAlreadyRestore}
                    restorations={props.restorations}
                />
            </TabsContent>
        </Tabs>
    );
};
