"use client"

import {ColumnDef} from "@tanstack/react-table"
import {StatusBadge} from "@/components/wrappers/status-badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Download, MoreHorizontal, Trash2} from "lucide-react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {Backup} from "@prisma/client";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {useMutation} from "@tanstack/react-query";
import {createRestaurationAction} from "@/features/restore/restore.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {TooltipCustom} from "@/components/wrappers/TooltipCustom/TooltipCustom";


export const backupColumns: ColumnDef<Backup>[] = [
    {
        accessorKey: "id",
        header: "Reference",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({row}) => {
            return new Date(row.getValue("createdAt")).toLocaleString("fr-FR");
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            return <StatusBadge status={row.getValue("status")}/>
        },
    },
    {
        id: "actions",
        cell: ({row, table}) => {
            const status = row.getValue("status")
            const rowData: Backup = row.original
            const fileName = rowData.file
            // @ts-ignore
            const {extendedProps} = table.options.meta;


            const isRestauring = !!rowData.restaurations.find(restauration => restauration.status === "waiting");

            const router = useRouter()

            const handleDownload = async (fileName: string) => {
                const url = await getFileUrlPresignedLocal(fileName)
                window.open(url, '_self');
            }


            const mutationRestore = useMutation({
                mutationFn: async () => {
                    const restauration = await createRestaurationAction({
                        backupId: rowData.id,
                        databaseId: rowData.databaseId
                    })
                    if (restauration.data.success) {
                        toast.success(restauration.data.actionSuccess?.message || "Restauration created successfully!");
                        router.refresh()
                    } else {
                        toast.error(restauration.serverError || "Failed to create restauration.");
                    }
                }})

            const handleRestore = async () => {
                await mutationRestore.mutateAsync()
            }

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
                        {status == "success" ?
                            <>
                                <TooltipCustom disabled={extendedProps} text="Already a restauration waiting">
                                    <DropdownMenuItem disabled={mutationRestore.isPending || extendedProps}
                                                      onClick={async () => {
                                                          await handleRestore()
                                                      }}>
                                        <ReloadIcon/> Restore
                                    </DropdownMenuItem>
                                </TooltipCustom>
                                <DropdownMenuItem onClick={async () => {
                                    await handleDownload(fileName)
                                }}>
                                    <Download/> Download
                                </DropdownMenuItem>
                            </>
                            : null}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                        }}>
                            <Trash2/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]