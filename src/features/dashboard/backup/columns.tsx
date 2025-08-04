"use client";

import {ColumnDef} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Download, MoreHorizontal, Trash2} from "lucide-react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {useMutation} from "@tanstack/react-query";
import {createRestorationAction, deleteBackupAction} from "@/features/dashboard/restore/restore.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {StatusBadge} from "@/components/wrappers/common/status-badge";
import {Backup} from "@/db/schema/06_database";
import {formatFrenchDate} from "@/utils/date-formatting";
import {TooltipCustom} from "@/components/wrappers/common/tooltip-custom";


export function backupColumns(isAlreadyRestore: boolean): ColumnDef<Backup>[] {

    return [

        {
            accessorKey: "id",
            header: "Reference",
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({row}) => {
                return formatFrenchDate(row.getValue("createdAt"))
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => {
                return <StatusBadge status={row.getValue("status")}/>;
            },
        },
        {
            id: "actions",
            cell: ({row, table}) => {
                const status = row.getValue("status");
                const rowData: Backup = row.original;
                const fileName = rowData.file;

                const router = useRouter();

                const mutationRestore = useMutation({
                    mutationFn: async () => {
                        const restoration = await createRestorationAction({
                            backupId: rowData.id,
                            databaseId: rowData.databaseId,
                        });
                        // @ts-ignore
                        if (restoration.data.success) {
                            // @ts-ignore
                            toast.success(restoration.data.actionSuccess?.message || "Restoration created successfully!");
                            router.refresh();
                        } else {
                            // @ts-ignore
                            toast.error(restoration.serverError || "Failed to create restoration.");
                        }
                    },
                });

                const mutationDeleteBackup = useMutation({
                    mutationFn: async () => {
                        const restoration = await deleteBackupAction({
                            backupId: rowData.id,
                            databaseId: rowData.databaseId,
                        });
                        // @ts-ignore
                        if (restoration.data.success) {
                            // @ts-ignore
                            toast.success(restoration.data.actionSuccess.message);
                            router.refresh();
                        } else {
                            // @ts-ignore
                            toast.error(restoration.data.actionError.message);
                        }
                    },
                });

                const handleRestore = async () => {
                    await mutationRestore.mutateAsync();
                };

                const handleDelete = async () => {
                    await mutationDeleteBackup.mutateAsync();
                };

                const handleDownload = async (fileName: string) => {
                    const url = await getFileUrlPresignedLocal(fileName);
                    window.open(url, "_self");
                };

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {status == "success" ? (
                                <>
                                    <TooltipCustom disabled={isAlreadyRestore} text="Already a restoration waiting">
                                        <DropdownMenuItem
                                            disabled={mutationRestore.isPending || isAlreadyRestore}
                                            onClick={async () => {
                                                await handleRestore();
                                            }}
                                        >
                                            <ReloadIcon/> Restore
                                        </DropdownMenuItem>
                                    </TooltipCustom>
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            await handleDownload(fileName ?? "");
                                        }}
                                    >
                                        <Download/> Download
                                    </DropdownMenuItem>
                                </>
                            ) : null}
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={async () => {
                                    await handleDelete();
                                }}
                            >
                                <Trash2/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}