"use client"
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {updateUserAction} from "@/components/wrappers/dashboard/profile/user-form/user-form.action";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Trash2} from "lucide-react";
import {deleteUserAction} from "@/components/wrappers/dashboard/profile/button-delete-account/delete-account.action";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {User} from "@/db/schema/01_user";
import {useSession} from "@/lib/auth/auth-client";
import {formatFrenchDate} from "@/utils/date-formatting";

export const usersColumnsAdmin: ColumnDef<User>[] = [
    {
        accessorKey: "role",
        header: "Role",
        cell: ({row}) => {
            const [role, setRole] = useState<string>(row.getValue("role"));
            const { data: session } = useSession();
            const isCurrentUser = session?.user.email === row.original.email;

            const updateMutation = useMutation({
                mutationFn: () => updateUserAction({id: row.original.id, data: {role: role}}),
                onSuccess: () => {
                    toast.success(`User updated successfully.`);
                },
                onError: () => {
                    toast.error(`An error occurred while updating user information.`);
                },
            });

            const handleUpdateRole = async () => {
                const nextRole = role === "admin" ? "pending" : role === "pending" ? "user" : "admin";
                setRole(nextRole);
                await updateMutation.mutateAsync();
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
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({row}) => {
            return formatFrenchDate(row.getValue("updatedAt"))
        },
    },
    {
        header: "Action",
        id: "actions",
        cell: ({row}) => {
            const router = useRouter();
            const {data: session, isPending} = useSession();

            const mutation = useMutation({
                mutationFn: () => deleteUserAction(row.original.id),
                onSuccess: async () => {
                    toast.success("User deleted successfully.");
                    router.refresh();
                },
            });

            return (
                <div className="flex items-center gap-2">
                        <ButtonWithLoading
                            disabled={!session || session?.user.email === row.original.email}
                            variant="outline"
                            text=""
                            icon={<Trash2 color="red" size={15}/>}
                            onClick={async () => {
                                await mutation.mutateAsync();
                            }}
                            size="sm"
                        />
                </div>
            );
        },
    },
];
