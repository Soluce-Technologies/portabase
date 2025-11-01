"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {MoreHorizontal, Trash2} from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { StatusBadge } from "@/components/wrappers/common/status-badge";
import {Backup, Restoration} from "@/db/schema/07_database";
import {formatFrenchDate} from "@/utils/date-formatting";
import {useMutation} from "@tanstack/react-query";
import {
    deleteBackupAction,
    deleteRestoreAction,
    rerunRestorationAction
} from "@/features/dashboard/restore/restore.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {TooltipCustom} from "@/components/wrappers/common/tooltip-custom";
import {MemberWithUser} from "@/db/schema/03_organization";


export function restoreColumns(
    isAlreadyRestore: boolean,
    activeMember: MemberWithUser
): ColumnDef<Restoration>[] {
    return[
    {
        accessorKey: "id",
        header: "Reference",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return formatFrenchDate(row.getValue("createdAt"))
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <StatusBadge status={row.getValue("status")} />;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const status = row.getValue("status");

            const router = useRouter();
            const rowData: Restoration = row.original;


            const mutationDeleteRestore = useMutation({
                mutationFn: async () => {
                    const restoration = await deleteRestoreAction({
                        restorationId: rowData.id,
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

            const mutationRerunRestore = useMutation({
                mutationFn: async () => {
                    const restoration = await rerunRestorationAction({
                        restorationId: rowData.id,
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



            const handleDelete = async () => {
                await mutationDeleteRestore.mutateAsync();
            };

            const handleRerunRestore = async () => {
                await mutationRerunRestore.mutateAsync();

            }


            return (
                <>
                    {activeMember.role != "member" && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <TooltipCustom disabled={isAlreadyRestore} text="Already a restoration waiting">
                                    <DropdownMenuItem
                                        disabled={mutationRerunRestore.isPending || isAlreadyRestore}
                                        onClick={async () => {
                                            await handleRerunRestore();
                                        }}
                                    >
                                        <ReloadIcon/> Rerun
                                    </DropdownMenuItem>
                                </TooltipCustom>
                                <DropdownMenuSeparator/>

                                <DropdownMenuItem
                                    disabled={status == "waiting"}
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

