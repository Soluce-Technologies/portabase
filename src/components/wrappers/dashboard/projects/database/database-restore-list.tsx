"use client"
import {DataTable} from "@/components/wrappers/common/table/data-table";
import {restoreColumns} from "@/features/dashboard/restore/columns";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {MoreHorizontal, Trash2} from "lucide-react";
import {Restoration} from "@/db/schema/07_database";
import {useMutation} from "@tanstack/react-query";
import {deleteRestoreAction} from "@/features/dashboard/restore/restore.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {MemberWithUser} from "@/db/schema/03_organization";


type DatabaseRestoreListProps = {
    isAlreadyRestore: boolean;
    restorations: Restoration[];
    activeMember: MemberWithUser
}

export const DatabaseRestoreList = (props: DatabaseRestoreListProps) => {
    const router = useRouter();

    const mutationDeleteRestorations = useMutation({
        mutationFn: async (restorations: Restoration[]) => {
            const results = await Promise.all(
                restorations.map(async (restoration) => {
                    const restorationDeleted = await deleteRestoreAction({
                        restorationId: restoration.id,
                    });
                    return {
                        success: restorationDeleted?.data?.success,
                        message: restorationDeleted?.data?.success
                            ? restorationDeleted?.data?.actionSuccess?.message
                            // @ts-ignore
                            : restorationDeleted?.data?.actionError.message,
                    };


                })
            );
            results.forEach((result) => {
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            });
            router.refresh();
        },
    });
    const isMember = props.activeMember.role === "member";


    return (
        <DataTable
            enableSelect={!isMember}
            columns={restoreColumns(props.isAlreadyRestore, props.activeMember)}
            data={props.restorations}
            enablePagination
            selectedActions={(rows) => (
                <>
                    {!isMember && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ButtonWithLoading
                                    variant="outline"
                                    text="Actions"
                                    onClick={() => {
                                    }}
                                    disabled={rows.length === 0 || mutationDeleteRestorations.isPending}
                                    icon={<MoreHorizontal/>}
                                    isPending={mutationDeleteRestorations.isPending}
                                    size="sm"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onClick={async () => {
                                        await mutationDeleteRestorations.mutateAsync(rows)
                                    }}
                                    disabled={props.isAlreadyRestore}
                                    className="text-red-600 focus:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-2"/>
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </>
            )}
        />
    )
}