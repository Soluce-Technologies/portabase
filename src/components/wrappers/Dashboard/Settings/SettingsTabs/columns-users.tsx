"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge";
import {User} from "@prisma/client";

export const usersColumns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({row}) => {
            return new Date(row.getValue("createdAt")).toLocaleString("fr-FR");
        },
    },
    {
        accessorKey: "authMethod",
        header: "Method",
        cell: ({row}) => {
            return <Badge variant="outline">{row.getValue("authMethod")}</Badge>
        },
    }
]