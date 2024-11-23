"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge";
import {User} from "@prisma/client";
import {updateUserAction} from "@/components/wrappers/Dashboard/Profile/UserForm/user-form.action";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useState} from "react";

export const usersColumns: ColumnDef<User>[] = [
    {
        accessorKey: "role",
        header: "Role",
        cell: ({row}) => {
            const router = useRouter();
            const [role, setRole] = useState<string>(row.getValue("role"))

            const updateMutation = useMutation({
                mutationFn: () => updateUserAction({id: row.original.id, data: {role: role}}),
                onSuccess: () => {
                    toast.success(`User updated successfully.`);
                    router.refresh()

                },
                onError: () => {
                    toast.error(`An error occurred while updating user information.`);
                },
            });

            const handleUpdateRole = async () => {
                const nextRole = role === "admin" ? "pending"
                    : role === "pending" ? "user"
                        : "admin";
                setRole(nextRole);
                await updateMutation.mutateAsync()
            };

            return <Badge
                className="cursor-pointer"
                onClick={() => handleUpdateRole()}
                variant="outline">{role}</Badge>
        },
    },
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