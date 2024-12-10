"use client"
import {useMutation} from "@tanstack/react-query";
import {backupButtonAction} from "@/components/wrappers/BackupButton/backup-button.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {ButtonWithLoading} from "@/components/wrappers/Button/ButtonWithLoading/ButtonWithLoading";

export type BackupButtonProps = {
    databaseId: string;
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
