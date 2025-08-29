"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {eventUpdate} from "@/types/events";
import {backupColumns} from "@/features/dashboard/backup/columns";
import {restoreColumns} from "@/features/dashboard/restore/columns";
import {DataTable} from "@/components/wrappers/common/table/data-table";
import {Backup, Database, DatabaseWith, Restoration} from "@/db/schema/07_database";
import {Setting} from "@/db/schema/01_setting";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Trash2} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {deleteBackupAction, deleteRestoreAction} from "@/features/dashboard/restore/restore.action";
import {toast} from "sonner";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";

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


    const mutationDeleteBackups = useMutation({
        mutationFn: async (backups: Backup[]) => {
            const results = await Promise.all(
                backups.map(async (backup) => {
                    const backupDeleted = await deleteBackupAction({
                        backupId: backup.id,
                        databaseId: backup.databaseId,
                        file: backup.file!,
                        projectSlug: props.database?.project?.slug!
                    });
                    return {
                        success: backupDeleted?.data?.success,
                        message: backupDeleted?.data?.success
                            ? backupDeleted?.data?.actionSuccess?.message
                            // @ts-ignore
                            : restoration?.data?.actionError.message,
                    };
                })
            );
            results.forEach((result) => {
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            });
            router.refresh();
        },
    });

    const mutationDeleteRestorations = useMutation({
        mutationFn: async (restorations: Restoration[]) => {
            const results = await Promise.all(
                restorations.map(async (restoration) => {
                    const restorationDeleted = await deleteRestoreAction({
                        restorationId: restoration.id,
                    });
                    return {
                        success: restorationDeleted?.data?.success,
                        message: restorationDeleted?.data?.success
                            ? restorationDeleted?.data?.actionSuccess?.message
                            // @ts-ignore
                            : restorationDeleted?.data?.actionError.message,
                    };
                })
            );
            results.forEach((result) => {
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            });
            router.refresh();
        },
    });


    return (
        <Tabs className="flex flex-col flex-1" value={tab} onValueChange={handleChangeTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="backup">Backup</TabsTrigger>
                <TabsTrigger value="restore">Restoration</TabsTrigger>
            </TabsList>
            <TabsContent className="h-full justify-between" value="backup">
                <DataTable
                    columns={backupColumns(props.isAlreadyRestore, props.settings, props.database)}
                    data={props.backups}
                    enablePagination
                    selectedActions={(rows) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ButtonWithLoading
                                    variant="outline"
                                    text="Actions"
                                    onClick={() => {

                                    }}
                                    disabled={rows.length === 0 || mutationDeleteBackups.isPending}
                                    icon={<MoreHorizontal/>}
                                    isPending={mutationDeleteBackups.isPending}
                                    size="sm"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {/*<DropdownMenuItem*/}
                                {/*    onClick={() => {*/}
                                {/*        console.log("Deleting rows:", rows)*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <Download className="w-4 h-4 mr-2"/>*/}
                                {/*    Download Selected*/}
                                {/*</DropdownMenuItem>*/}
                                {/*<Separator/>*/}
                                <DropdownMenuItem
                                    onClick={async () => {
                                        console.log("Deleting rows:", rows)
                                        await mutationDeleteBackups.mutateAsync(rows)
                                    }}
                                    className="text-red-600 focus:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-2"/>
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </TabsContent>
            <TabsContent className="h-full justify-between" value="restore">
                <DataTable
                    columns={restoreColumns(props.isAlreadyRestore)}
                    data={props.restorations}
                    enablePagination
                    selectedActions={(rows) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ButtonWithLoading
                                    variant="outline"
                                    text="Actions"
                                    onClick={() => {
                                    }}
                                    disabled={rows.length === 0 || mutationDeleteRestorations.isPending}
                                    icon={<MoreHorizontal/>}
                                    isPending={mutationDeleteRestorations.isPending}
                                    size="sm"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onClick={async () => {
                                        await mutationDeleteRestorations.mutateAsync(rows)
                                    }}
                                    disabled={props.isAlreadyRestore}
                                    className="text-red-600 focus:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-2"/>
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </TabsContent>
        </Tabs>
    );
};
