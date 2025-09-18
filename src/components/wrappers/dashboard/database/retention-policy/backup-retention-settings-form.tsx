"use client"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useZodForm
} from "@/components/ui/form";
import {DatabaseType} from "@/components/wrappers/dashboard/database/database-form/form-database.schema";
import {RetentionSettings, RetentionSettingsSchema} from "./backup-retention-settings.schema";
import {useMutation} from "@tanstack/react-query";
import {updateOrCreateBackupRetentionPolicyAction} from "./backup-retention-settings.action";
import {Database, DatabaseWith, RetentionPolicy} from "@/db/schema/07_database";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Calendar, Save} from "lucide-react";


export type BackupRetentionSettingsFormProps = {
    defaultValues?: RetentionPolicy;
    database: DatabaseWith;
};


export const BackupRetentionSettingsForm = ({defaultValues, database}: BackupRetentionSettingsFormProps) => {
    const router = useRouter();

    const form = useZodForm({
        schema: RetentionSettingsSchema,
        defaultValues: {
            type: defaultValues?.type ?? "gfs",
            count: defaultValues?.count ?? 7,
            days: defaultValues?.days ?? 30,
            gfs: {
                daily: defaultValues?.gfsDaily ?? 7,
                weekly: defaultValues?.gfsWeekly ?? 4,
                monthly: defaultValues?.gfsMonthly ?? 12,
                yearly: defaultValues?.gfsYearly ?? 3,
            },
        },
    });

    const mutation = useMutation({
        mutationFn: async (payload: RetentionSettings) =>
            await updateOrCreateBackupRetentionPolicyAction({
                databaseId: database.id,
                settings: payload,
            }),
        onSuccess: () => {
            toast.success("Retention policy updated successfully.");
            router.refresh()
        },
        onError: () => {
            toast.error("An error occurred while updating retention policy.");
        },
    });

    const calculateTotalFiles = (values: RetentionSettings) => {
        if (values.type === "gfs") {
            return values.gfs.daily + values.gfs.weekly + values.gfs.monthly + values.gfs.yearly;
        }
        return values.type === "count" ? values.count : values.days;
    };

    const getStorageEstimate = (totalFiles: number) => {
        if (totalFiles <= 10) return "Low";
        if (totalFiles <= 30) return "Medium";
        return "High";
    };

    return (
        <div className=" flex flex-col gap-3 py-0">
            <div className="px-3">
                <Form
                    form={form}
                    className="flex flex-col gap-6 mt-0"
                    onSubmit={async (values) => {
                        await mutation.mutateAsync(values);
                    }}
                >
                    <FormField
                        control={form.control}
                        name="type"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Retention Policy Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="grid grid-cols-1 gap-4"
                                    >
                                        <div
                                            className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem value="count" id="count"/>
                                            <div className="flex-1">
                                                <FormLabel htmlFor="count" className="font-medium cursor-pointer">
                                                    Keep last N backups
                                                </FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Simple count-based retention (e.g., keep last 10 backups)
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem value="days" id="days"/>
                                            <div className="flex-1">
                                                <FormLabel htmlFor="days" className="font-medium cursor-pointer">
                                                    Keep backups for X days
                                                </FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Time-based retention (e.g., keep backups for 30 days)
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors bg-accent/5">
                                            <RadioGroupItem value="gfs" id="gfs"/>
                                            <div className="flex-1">
                                                <FormLabel htmlFor="gfs"
                                                           className="font-medium cursor-pointer flex items-center gap-2">
                                                    GFS Rotation
                                                    <Badge variant="secondary" className="text-xs">
                                                        Recommended
                                                    </Badge>
                                                </FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Grandfather-Father-Son rotation for enterprise/critical systems
                                                </p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Separator/>

                    {/* Count config */}
                    {form.watch("type") === "count" && (
                        <FormField
                            control={form.control}
                            name="count"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Number of backups to keep</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} max={100} className="w-32" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Older backups beyond this count will be automatically deleted.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Days config */}
                    {form.watch("type") === "days" && (
                        <FormField
                            control={form.control}
                            name="days"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Retention period (days)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} max={3650} className="w-32" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Backups older than {field.value} days will be automatically deleted.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* GFS config */}
                    {form.watch("type") === "gfs" && (
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="gfs.daily"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Daily backups</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={1} max={31} {...field} />
                                        </FormControl>
                                        <FormDescription>Keep last N daily backups</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gfs.weekly"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Weekly backups</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} max={52} {...field} />
                                        </FormControl>
                                        <FormDescription>Keep N weekly backups</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gfs.monthly"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Monthly backups</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} max={120} {...field} />
                                        </FormControl>
                                        <FormDescription>Keep N monthly backups</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gfs.yearly"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Yearly backups</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} max={50} {...field} />
                                        </FormControl>
                                        <FormDescription>Keep N yearly backups</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <Separator/>

                    {/* Summary */}
                    <div className="rounded-lg border p-4 space-y-3 bg-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <span className="font-medium">Storage Impact Summary</span>
                            </div>
                            {(() => {
                                const totalFiles = calculateTotalFiles(form.getValues());
                                const estimate = getStorageEstimate(totalFiles);
                                return (
                                    <Badge
                                        variant={
                                            estimate === "Low"
                                                ? "default"
                                                : estimate === "Medium"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {estimate} Usage
                                    </Badge>
                                );
                            })()}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Estimated files per database:</span>
                                <p className="font-medium">{calculateTotalFiles(form.getValues())} backup files</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Policy type:</span>
                                <p className="font-medium capitalize">
                                    {form.watch("type") === "gfs"
                                        ? "GFS Rotation"
                                        : form.watch("type") === "count"
                                            ? "Count-based"
                                            : "Time-based"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={mutation.isPending} className="w-full">
                        <Save className="h-4 w-4 mr-2"/>
                        {mutation.isPending ? "Saving Policy..." : "Save Retention Policy"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}