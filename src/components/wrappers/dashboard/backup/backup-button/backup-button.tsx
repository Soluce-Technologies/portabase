"use client"

import {useRouter} from "next/navigation";

import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

import {backupButtonAction} from "@/components/wrappers/dashboard/backup/backup-button/backup-button.action";
import {ButtonWithLoading} from "@/components/wrappers/common/button/ButtonWithLoading/ButtonWithLoading";

export type BackupButtonProps = {
    databaseId: string
    disable: boolean
}

export const BackupButton = (props: BackupButtonProps) => {
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: async (databaseId: string) => {
            const backup = await backupButtonAction(databaseId)
            console.log(backup)
            if (backup.data.success) {
                toast.success(backup.data.actionSuccess?.message || "Backup created successfully!");
                router.refresh()
            } else {
                toast.error(backup.serverError || "Failed to create backup.");
            }
        }
    })
    const HandleAction = async () => {
        await mutation.mutateAsync(props.databaseId)
    }

    return (
        <ButtonWithLoading
            disabled={props.disable}
            text="Backup"
            isPending={mutation.isPending}
            size={"default"}
            onClick={async () => {
                await HandleAction()
            }}
        />
    )
}
