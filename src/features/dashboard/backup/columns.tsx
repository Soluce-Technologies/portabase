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
import {
    getFileUrlPresignedLocal,
    getFileUrlPreSignedS3Action
} from "@/features/upload/private/upload.action";
import {useMutation} from "@tanstack/react-query";
import {createRestorationAction, deleteBackupAction} from "@/features/dashboard/restore/restore.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {StatusBadge} from "@/components/wrappers/common/status-badge";
import {Backup, DatabaseWith} from "@/db/schema/07_database";
import {formatFrenchDate} from "@/utils/date-formatting";
import {TooltipCustom} from "@/components/wrappers/common/tooltip-custom";
import {Setting} from "@/db/schema/01_setting";
import {SafeActionResult} from "next-safe-action";
import {ZodString} from "zod";
import {ServerActionResult} from "@/types/action-type";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";


export function backupColumns(isAlreadyRestore: boolean, settings: Setting, database: DatabaseWith): ColumnDef<Backup>[] {
    return [
        {
            id: "availability",
            cell: ({row}) => {
                const colorStatus = row.original.deletedAt != null ? "bg-red-400 border-red-600" : "bg-green-400 border-green-600";
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={cn("w-5 h-5 rounded-full border-4", colorStatus)}/>
                            </TooltipTrigger>
                            {row.original.deletedAt != null && (
                                <TooltipContent>
                                    <p>{formatFrenchDate(row.getValue("deletedAt"))}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                )
            },
        },
        {
            accessorKey: "id",
            header: "Reference",
        },
        // {
        //     accessorKey: "deletedAt",
        //     header: "Deleted At",
        //     cell: ({row}) => {
        //         return row.original.deletedAt ? formatFrenchDate(row.getValue("deletedAt")) : "-"
        //     },
        // },
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


                        const deletion = await deleteBackupAction({
                            backupId: rowData.id,
                            databaseId: rowData.databaseId,
                            file: rowData.file!,
                            projectSlug: database.project?.slug!
                        });
                        // @ts-ignore
                        if (deletion.data.success) {
                            // @ts-ignore
                            toast.success(deletion.data.actionSuccess.message);
                            router.refresh();
                        } else {
                            // @ts-ignore
                            toast.error(deletion.data.actionError.message);
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

                    let url: string = "";
                    let data: SafeActionResult<string, ZodString, readonly [], {
                        _errors?: string[] | undefined;
                    }, readonly [], ServerActionResult<string>, object> | undefined

                    if (settings.storage == "local") {
                        data = await getFileUrlPresignedLocal(fileName!)
                    } else if (settings.storage == "s3") {
                        data = await getFileUrlPreSignedS3Action(`backups/${database.project?.slug}/${fileName}`);
                    }
                    console.log(data)
                    if (data?.data?.success) {
                        url = data.data.value ?? "";
                    } else {
                        // @ts-ignore
                        const errorMessage = data?.data?.actionError?.message || "Failed to get file!";
                        toast.error(errorMessage);
                    }

                    window.open(url, "_self");
                };

                return (
                    <>
                        {rowData.deletedAt == null && (

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
                                            <TooltipCustom disabled={isAlreadyRestore}
                                                           text="Already a restoration waiting">
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
                        )}
                    </>

                );
            },
        },
    ];
}