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
import {UserWithAccounts} from "@/db/schema/02_user";
import {authClient, useSession} from "@/lib/auth/auth-client";
import {providerSwitch} from "@/components/wrappers/common/provider-switch";
import {ButtonDeleteUser} from "@/components/wrappers/dashboard/admin/tabs/admin-user-tab/button-delete-use";
import {Organization} from "@/db/schema/03_organization";

export const organizationsColumnsAdmin: ColumnDef<Organization>[] = [

    {
        accessorKey: "name",
        header: "Name",
    },

    // {
    //     header: "Action",
    //     id: "actions",
    //     cell: ({row}) => {
    //         const router = useRouter();
    //         const {data: session, isPending} = useSession();
    //         const isSuperAdmin = session?.user.role == "superadmin";
    //
    //         return (
    //             <ButtonDeleteUser
    //                 disabled={!isSuperAdmin || !session || session?.user.email === row.original.email}
    //                 userId={row.original.id}/>
    //         );
    //     },
    // },
];
