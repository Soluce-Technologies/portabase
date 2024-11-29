"use client"
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {backupButtonAction} from "@/components/wrappers/BackupButton/backup-button.action";

export type BackupButtonProps = {
    // databaseId: string;
}

export const BackupButton = () => {


    const mutation = useMutation({
        mutationFn: async (databaseId: string) => {
            const result = await backupButtonAction(databaseId)
            console.log(result)
        }
    })


    return (
        <Button
            onClick={() => {
                mutation.mutateAsync("cm430tnop0001bcm0vo9b5nfx")
            }}
        >Backup
        </Button>
    )
}
