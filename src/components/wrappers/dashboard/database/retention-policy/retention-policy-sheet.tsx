import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Database, DatabaseZap} from "lucide-react";
import {
    BackupRetentionSettings
} from "@/components/wrappers/dashboard/database/retention-policy/backup-retention-settings";
import {DatabaseWith as DbSchema, RetentionPolicy} from "@/db/schema/07_database";
import {
    BackupRetentionSettingsForm
} from "@/components/wrappers/dashboard/database/retention-policy/backup-retention-settings-form";

type RetentionPolicySheetProps = {
    database: DbSchema
}

export const RetentionPolicySheet = (props: RetentionPolicySheetProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <DatabaseZap/>
                </Button>
            </SheetTrigger>
            <SheetContent
                className="flex gap-4 p-4 w-[540px] sm:w-[800px] max-w-[800px] max-h-screen overflow-y-scroll"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-balance">
                        <Database className="h-5 w-5"/>
                        Backup Retention Policy
                    </SheetTitle>
                    <SheetDescription className="text-pretty">
                        Configure how long to keep your .dump backup files. Choose from simple count-based, time-based,
                        or
                        enterprise GFS rotation strategies.
                    </SheetDescription>
                </SheetHeader>

                <BackupRetentionSettingsForm database={props.database} defaultValues={props.database.retentionPolicy as RetentionPolicy}/>

                {/*<BackupRetentionSettings database={props.database}/>*/}
            </SheetContent>
        </Sheet>
    )
}