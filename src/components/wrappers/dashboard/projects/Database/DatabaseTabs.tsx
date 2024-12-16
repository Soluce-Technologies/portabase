"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataTableWithPagination} from "@/components/wrappers/common/table/data-table-with-pagination";
import {backupColumns} from "@/features/backup/columns";
import {restoreColumns} from "@/features/restore/columns";
import {Backup, Database, Restoration} from "@prisma/client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {eventUpdate} from "@/types/events";

export type DatabaseTabsProps = {
    backups: Backup[]
    restorations: Restoration[]
    isAlreadyRestore: boolean
    database: Database
}

export const DatabaseTabs = (props: DatabaseTabsProps) => {

    const router = useRouter();
    useEffect(() => {
        const eventSource = new EventSource('/api/events');

        eventSource.addEventListener('modification', (event) => {
            const data: eventUpdate = JSON.parse(event.data)
            if (data.update) {
                console.log("update", data.update)
                router.refresh()
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
                <DataTableWithPagination columns={backupColumns} data={props.backups}
                                         extendedProps={props.isAlreadyRestore}/>
            </TabsContent>

            <TabsContent className="h-full justify-between" value="restore">
                <DataTableWithPagination columns={restoreColumns} data={props.restorations}/>
            </TabsContent>
        </Tabs>
    )
}