import { AdvancedCronSelect } from "./AdvancedCronSelect";
import {
    updateBackupPolicyAction,
    updateDatabaseBackupPolicyAction
} from "@/components/wrappers/dashboard/database/CronButton/cron.action";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Database} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

export type CronInputProps = {
    database : Database
}


export const CronInput = ({ database }: CronInputProps) => {
    const [cron, setCron] = useState<string>(database.backupPolicy ?? "* * * * *");
    const router = useRouter();

    const updateBackupPolicy = useMutation({
        mutationFn: (value: string) => updateDatabaseBackupPolicyAction({ databaseId: database.id, backupPolicy: value }),
        onSuccess: () => {
            toast.success(`Cron updated successfully.`);
            router.refresh();
        },
        onError: () => {
            toast.error(`An error occurred while updating cron value.`);
        },
    });

    const handleChangeCron = (type: string, value: string) => {
        const cronParts = cron.split(" ");
        const indexMap = { minute: 0, hour: 1, "day-of-month": 2, month: 3, "day-of-week": 4 };
        cronParts[indexMap[type]] = value;
        setCron(cronParts.join(" "));
    };

    const handleUpdateCron = async (cron: string) => {
        await updateBackupPolicy.mutateAsync(cron);
    };

    return (
        <>
            <h1>Configure your cron schedule</h1>
            <AdvancedCronSelect
                id="minute"
                label="Minute"
                options={Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))}
                type="minute"
                value={cron.split(" ")[0]}
                defaultValue={cron.split(" ")[0]}
                onValueChange={(value) => handleChangeCron("minute", value)}
            />
            <AdvancedCronSelect
                id="hour"
                label="Hour"
                options={Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))}
                type="hour"
                value={cron.split(" ")[1]}
                defaultValue={cron.split(" ")[1]}
                onValueChange={(value) => handleChangeCron("hour", value)}
            />
            <AdvancedCronSelect
                id="day-of-month"
                label="Day of Month"
                options={Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))}
                type="day-of-month"
                value={cron.split(" ")[2]}
                defaultValue={cron.split(" ")[2]}
                onValueChange={(value) => handleChangeCron("day-of-month", value)}
            />
            <AdvancedCronSelect
                id="month"
                label="Month"
                options={["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]}
                type="month"
                value={cron.split(" ")[3]}
                defaultValue={cron.split(" ")[3]}
                onValueChange={(value) => handleChangeCron("month", value)}
            />
            <AdvancedCronSelect
                id="day-of-week"
                label="Day of Week"
                options={["0", "1", "2", "3", "4", "5", "6"]}
                type="day-of-week"
                value={cron.split(" ")[4]}
                defaultValue={cron.split(" ")[4]}
                onValueChange={(value) => handleChangeCron("day-of-week", value)}
            />
            <Separator />
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <div className="font-semibold">Cron Expression</div>
                    <div className="font-mono text-muted-foreground">{cron}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                    This cron expression determines when the job will run.
                </div>
            </div>
            <div className="flex justify-between gap-2">
                <Button
                    onClick={async () => {
                        setCron("* * * * *");
                        await handleUpdateCron("* * * * *");
                    }}
                    variant="destructive"
                >
                    Reset
                </Button>
                <Button
                    onClick={async () => {
                        await handleUpdateCron(cron);
                    }}
                >
                    Save cron
                </Button>
            </div>
        </>
    );
};