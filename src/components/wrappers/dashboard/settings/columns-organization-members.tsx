"use client";

import {ColumnDef} from "@tanstack/react-table";
import {MemberWithUser} from "@/db/schema/03_organization";
import {useState} from "react";
import {authClient, useSession} from "@/lib/auth/auth-client";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import {updateMemberRoleAction} from "@/components/wrappers/dashboard/settings/update-member.action";
import {RoleSchemaMember} from "@/components/wrappers/dashboard/settings/member.schema";


export const organizationMemberColumns: ColumnDef<MemberWithUser>[] = [
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const [role, setRole] = useState<string>(row.getValue("role"));
            const { data: session } = useSession();


            const updateMutation = useMutation({
                mutationFn: () =>
                    updateMemberRoleAction({
                        memberId: row.original.id,
                        organizationId: row.original.organizationId,
                        role: RoleSchemaMember.parse(role),
                    }),
                onSuccess: () => {
                    toast.success(`User updated successfully.`);
                },
                onError: () => {
                    toast.error(`An error occurred while updating user information.`);
                },
            });

            const handleUpdateRole = async () => {
                const nextRole =
                    role === "owner" ? "admin" : role === "admin" ? "member" : "owner";
                setRole(nextRole);
                await updateMutation.mutateAsync();
            };


            const isCurrentUser = session?.user.email === row.original.user.email;
            const isMember = session?.user.role === "member";


            const isDisabled = isMember || isCurrentUser;

            return (
                <Badge
                    className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    onClick={isDisabled ? undefined : handleUpdateRole}
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
