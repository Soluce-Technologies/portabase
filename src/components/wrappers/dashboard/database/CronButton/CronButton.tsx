"use client";
import { Clock9 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CronInput } from "@/components/wrappers/dashboard/database/CronButton/CronInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateDatabaseBackupPolicyAction } from "@/components/wrappers/dashboard/database/CronButton/cron.action";
import { Database } from "@/db/schema";

export type CronButtonProps = {
    database: Database;
};

export const CronButton = (props: CronButtonProps) => {
    const router = useRouter();
    const [isSwitched, setIsSwitched] = useState(props.database.backupPolicy !== null);

    const updateDatabaseBackupPolicy = useMutation({
        mutationFn: (value: string) => updateDatabaseBackupPolicyAction({ databaseId: props.database.id, backupPolicy: value }),
        onSuccess: () => {
            toast.success(`Method updated successfully.`);
            router.refresh();
        },
        onError: () => {
            toast.error(`An error occurred while updating backup method.`);
        },
    });

    const handleTypeChange = async (state: boolean) => {
        setIsSwitched(state);
        if (state == false) {
            await updateDatabaseBackupPolicy.mutateAsync("");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" {...props}>
                    <Clock9 />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Backup method</DialogTitle>
                    <DialogDescription>Your settings for the backup method</DialogDescription>
                </DialogHeader>
                <Separator />

                <h1>Select your backup method</h1>
                <div className="flex items-center space-x-2">
                    <Label>Manual / Automatic </Label>
                    <Switch
                        checked={isSwitched}
                        onCheckedChange={async () => {
                            await handleTypeChange(!isSwitched);
                        }}
                        id="type-mode"
                    />
                </div>
                {isSwitched ? <CronInput database={props.database} /> : null}
            </DialogContent>
        </Dialog>
    );
};
