"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { eventUpdate } from "@/types/events";
import { backupColumns } from "@/features/dashboard/backup/columns";
import { restoreColumns } from "@/features/dashboard/restore/columns";
import { DataTable } from "@/components/wrappers/common/table/data-table";
import {Backup, Database, DatabaseWith, Restoration} from "@/db/schema/06_database";
import {Setting} from "@/db/schema/00_setting";

export type DatabaseTabsProps = {
    settings: Setting
    backups: Backup[];
    restorations: Restoration[];
    isAlreadyRestore: boolean;
    database: DatabaseWith;
};

export const DatabaseTabs = (props: DatabaseTabsProps) => {
    const router = useRouter();
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

    return (
        <Tabs className="flex flex-col flex-1" defaultValue="backup">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="backup">Backup</TabsTrigger>
                <TabsTrigger value="restore">Restoration</TabsTrigger>
            </TabsList>

            <TabsContent className="h-full justify-between" value="backup">
                <DataTable columns={backupColumns(props.isAlreadyRestore, props.settings, props.database)} data={props.backups} enablePagination />
            </TabsContent>
            <TabsContent className="h-full justify-between" value="restore">
                <DataTable columns={restoreColumns(props.isAlreadyRestore)} data={props.restorations} enablePagination />
            </TabsContent>
        </Tabs>
    );
};
