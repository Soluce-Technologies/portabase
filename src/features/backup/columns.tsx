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
        cell: ({row}) => {

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

                        <DropdownMenuItem onClick={() => {
                        }}>
                            <ReloadIcon/> Restore
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => {
                        }}>
                            <Download/> Download
                        </DropdownMenuItem>

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