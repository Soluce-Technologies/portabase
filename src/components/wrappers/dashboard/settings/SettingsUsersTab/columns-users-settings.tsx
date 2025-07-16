"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateUserOrganizationAction } from "@/components/wrappers/dashboard/settings/SettingsUsersTab/settings-user-tab.action";
import {OrganizationMember} from "@/db/schema/03_member";

export const usersColumns: ColumnDef<OrganizationMember>[] = [
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const router = useRouter();
            const [role, setRole] = useState<string>(row.getValue("role"));

            const updateMutation = useMutation({
                mutationFn: () => updateUserOrganizationAction({ id: row.original.id, role: role }),
                onSuccess: () => {
                    toast.success(`User updated successfully.`);
                    // router.refresh()
                },
                onError: () => {
                    toast.error(`An error occurred while updating user information.`);
                },
            });

            const handleUpdateRole = async () => {
                const nextRole = role === "admin" ? "member" : role === "member" ? "admin" : "admin";
                setRole(nextRole);
                await updateMutation.mutateAsync();
            };

            return (
                <Badge className="cursor-pointer" onClick={() => handleUpdateRole()} variant="outline">
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "user.name",
        header: "Name",
    },
    {
        accessorKey: "user.email",
        header: "Email",
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            return new Date(row.getValue("updatedAt")).toLocaleString("fr-FR");
        },
    },
];
