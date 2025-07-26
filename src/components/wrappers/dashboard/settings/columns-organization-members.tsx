"use client";

import { ColumnDef } from "@tanstack/react-table";
import {MemberWithUser} from "@/db/schema/02_organization";
import {useState} from "react";
import {useSession} from "@/lib/auth/auth-client";
import {useMutation} from "@tanstack/react-query";
import {updateUserAction} from "@/components/wrappers/dashboard/profile/UserForm/user-form.action";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";

export const organizationMemberColumns: ColumnDef<MemberWithUser>[] = [
    {
        accessorKey: "role",
        header: "Role",
        cell: ({row}) => {
            const [role, setRole] = useState<string>(row.getValue("role"));
            const { data: session } = useSession();
            const isCurrentUser = session?.user.email === row.original.user.email;

            // const updateMutation = useMutation({
            //     mutationFn: () => updateUserAction({id: row.original.id, data: {role: role}}),
            //     onSuccess: () => {
            //         toast.success(`User updated successfully.`);
            //     },
            //     onError: () => {
            //         toast.error(`An error occurred while updating user information.`);
            //     },
            // });

            const handleUpdateRole = async () => {
                // const nextRole = role === "admin" ? "pending" : role === "pending" ? "user" : "admin";
                // setRole(nextRole);
                // await updateMutation.mutateAsync();
            };

            return (
                <Badge
                    className={isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    onClick={isCurrentUser ? undefined : () => handleUpdateRole()}
                    variant="outline"
                >
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
    }

];
