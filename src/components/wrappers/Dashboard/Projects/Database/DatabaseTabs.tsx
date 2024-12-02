import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataTableWithPagination} from "@/components/wrappers/table/data-table-with-pagination";
import {backupColumns} from "@/features/backup/columns";
import {restoreColumns} from "@/features/restore/columns";
import {Backup, Restauration} from "@prisma/client";

export type DatabaseTabsProps = {
    backups: Backup[]
    // restaurations: Restauration[]
}

export const DatabaseTabs = (props: DatabaseTabsProps) => {
    return (
        <Tabs className="flex flex-col flex-1" defaultValue="backup">

            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="backup">Backup</TabsTrigger>
                <TabsTrigger value="restore">Restoration</TabsTrigger>
            </TabsList>

            <TabsContent className="h-full justify-between" value="backup">
                    <DataTableWithPagination columns={backupColumns} data={props.backups}/>
            </TabsContent>

            {/*<TabsContent className="h-full justify-between" value="restore">*/}
            {/*    <DataTableWithPagination columns={restoreColumns} data={props.restaurations}/>*/}
            {/*</TabsContent>*/}
        </Tabs>
    )
}