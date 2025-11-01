"use client"
import {backupColumns} from "@/features/dashboard/backup/columns";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {MoreHorizontal, Trash2} from "lucide-react";
import {FilterItem, FiltersDropdown} from "@/components/wrappers/common/table/filters";
import {DataTable} from "@/components/wrappers/common/table/data-table";
import {useMemo, useState} from "react";
import {Backup, DatabaseWith} from "@/db/schema/07_database";
import {Setting} from "@/db/schema/01_setting";
import {useMutation} from "@tanstack/react-query";
import {deleteBackupAction} from "@/features/dashboard/restore/restore.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {MemberWithUser} from "@/db/schema/03_organization";


type DatabaseBackupListProps = {
    isAlreadyRestore: boolean;
    settings: Setting;
    database: DatabaseWith;
    backups: Backup[];
    activeMember: MemberWithUser
}


export const DatabaseBackupList = (props: DatabaseBackupListProps) => {

    const items = [
        {label: "Deleted", value: "deleted"},
        {label: "Available", value: "available"},
    ]

    const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([items[1]]);
    const router = useRouter();

    const filteredBackups = useMemo(() => {
        if (!props.backups) return [];

        return props.backups.filter(backup => {

            // --- Status Filter ---
            if (selectedFilters.length > 0) {
                const selectedValues = selectedFilters.map(f => f.value);
                const status = backup.deletedAt != null ? "deleted" : "available";
                if (!selectedValues.includes(status)) return false;
            }

            return true;
        });
    }, [props.backups, selectedFilters]);


    const handleSelectFilter = (item: FilterItem) => {
        setSelectedFilters(prev =>
            prev.some(f => f.value === item.value)
                ? prev.filter(f => f.value !== item.value)
                : [...prev, item]
        );
    };

    const clearFilters = () => setSelectedFilters([]);


    const mutationDeleteBackups = useMutation({
        mutationFn: async (backups: Backup[]) => {
            const results = await Promise.all(
                backups.map(async (backup) => {
                    if (backup.deletedAt == null) {
                        const backupDeleted = await deleteBackupAction({
                            backupId: backup.id,
                            databaseId: backup.databaseId,
                            status: backup.status,
                            file: backup.file ?? "",
                            projectSlug: props.database?.project?.slug!
                        });
                        return {
                            success: backupDeleted?.data?.success,
                            message: backupDeleted?.data?.success
                                ? backupDeleted?.data?.actionSuccess?.message
                                // @ts-ignore
                                : restoration?.data?.actionError.message,
                        };
                    }
                    return {
                        success: true,
                        message: `Already deleted this backup (ref: ${backup.id}).`,
                    }
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

    const isMember = props.activeMember.role === "member";

    return (
        <DataTable
            enableSelect={!isMember}
            columns={backupColumns(props.isAlreadyRestore, props.settings, props.database, props.activeMember)}
            data={filteredBackups}
            enablePagination
            selectedActions={(rows) => (
                <>

                        <div className="flex justify-start md:justify-between gap-3 md:gap-0 items-center w-full ml-0">
                            <div className="flex gap-2">
                                {!isMember && (
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
                                <FiltersDropdown
                                    items={items}
                                    selectedItems={selectedFilters}
                                    onSelect={handleSelectFilter}
                                    clearFilters={clearFilters}
                                />
                            </div>
                        </div>

                </>
            )}
        />
    )
}