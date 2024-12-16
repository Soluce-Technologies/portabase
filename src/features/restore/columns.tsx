"use client"

import {ColumnDef} from "@tanstack/react-table"
import {StatusBadge} from "@/components/wrappers/common/status-badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {Restoration} from "@prisma/client";


export const restoreColumns: ColumnDef<Restoration>[] = [
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
            const payment = row.original

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
                            <ReloadIcon/> Rerun
                        </DropdownMenuItem>


                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]