import {Form, FormControl, FormField, FormItem, FormMessage, useZodForm} from "@/components/ui/form";
import {InfoIcon, Plus, Trash2} from "lucide-react";
import {useFieldArray} from "react-hook-form";
import {
    AlertPoliciesSchema, AlertPoliciesType, AlertPolicyType,
    EVENT_KIND_OPTIONS
} from "@/components/wrappers/dashboard/database/alert-policy/alert-policy.schema";
import {DatabaseWith} from "@/db/schema/07_database";
import {AlertPolicy} from "@/db/schema/10_alert-policy";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {Separator} from "@/components/ui/separator";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MultiSelect} from "@/components/wrappers/common/multiselect/multi-select";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    createAlertPoliciesAction, deleteAlertPoliciesAction,
    updateAlertPoliciesAction
} from "@/components/wrappers/dashboard/database/alert-policy/alert-policy.action";
import {useRouter} from "next/navigation";
import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

type AlertPolicyFormProps = {
    onSuccess?: () => void;
    notificationChannels: NotificationChannel[];
    organizationId: string;
    database: DatabaseWith;
};

export const AlertPolicyForm = ({database, notificationChannels, organizationId, onSuccess}: AlertPolicyFormProps) => {
    const router = useRouter()
    const organizationNotificationChannels = notificationChannels.map(channel => channel.id) ?? [];

    const formattedAlertPoliciesList = (alertPolicies: AlertPolicy[]) => {
        return alertPolicies.map((alertPolicy) => ({
            notificationChannelId: alertPolicy.notificationChannelId,
            eventKinds: alertPolicy.eventKinds,
            enabled: alertPolicy.enabled
        }));
    };

    const form = useZodForm({
        schema: AlertPoliciesSchema,
        defaultValues: {
            alertPolicies: database.alertPolicies && database.alertPolicies.length > 0 ? formattedAlertPoliciesList(database.alertPolicies) : [{
                notificationChannelId: "",
                eventKinds: [],
                enabled: true,
            }],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "alertPolicies",
    })


    const addAlertPolicy = () => {
        append({id: "", eventKinds: [], enabled: true});
    }

    const removeAlertPolicy = (index: number) => {
        remove(index)
    }

    const onCancel = () => {
        form.reset()
        onSuccess?.()
    }


    const mutation = useMutation({
        mutationFn: async ({alertPolicies}: AlertPoliciesType) => {




            console.log(alertPolicies)

            const defaultFormatedAlertPolicies = formattedAlertPoliciesList(database?.alertPolicies ?? []);

            const alertPoliciesToAdd = alertPolicies?.filter(
                (alertPolicy) => !defaultFormatedAlertPolicies.some((a) => a.notificationChannelId == alertPolicy.notificationChannelId)
            ) ?? [];

            const alertPoliciesToRemove = defaultFormatedAlertPolicies.filter(
                (alertPolicy) => !alertPolicies?.some((v) => v.notificationChannelId === alertPolicy.notificationChannelId)
            ) ?? [];

            const alertPoliciesToUpdate = alertPolicies?.filter((alertPolicy) => {
                const existing = defaultFormatedAlertPolicies.find((a) => a.notificationChannelId === alertPolicy.notificationChannelId);
                return existing &&
                    (existing.eventKinds !== alertPolicy.eventKinds);
            }) ?? [];


            console.log("alertPoliciesToAdd", alertPoliciesToAdd)
            console.log("alertPoliciesToRemove", alertPoliciesToRemove)
            console.log("alertPoliciesToUpdate", alertPoliciesToUpdate)


            const results = await Promise.allSettled([
                alertPoliciesToAdd.length > 0
                    ? createAlertPoliciesAction({
                        databaseId: database.id,
                        alertPolicies: alertPoliciesToAdd,
                    })
                    : Promise.resolve(null),

                alertPoliciesToUpdate.length > 0
                    ? updateAlertPoliciesAction({
                        databaseId: database.id,
                        alertPolicies: alertPoliciesToUpdate,
                    })
                    : Promise.resolve(null),

                alertPoliciesToRemove.length > 0
                    ? deleteAlertPoliciesAction({
                        databaseId: database.id,
                        alertPolicies: alertPoliciesToRemove as AlertPolicyType[],
                    })
                    : Promise.resolve(null),
            ]);

            console.log(results);

            const rejected = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
            if (rejected) {
                throw new Error(rejected.reason?.message || "Network or server error");
            }

            const failedActions = results
                .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
                .map(r => r.value)
                .filter((value): value is { data: { success: false; actionError: any } } =>
                    value !== null && typeof value === "object" && value.data.success === false
                );


            console.log("failedActions", failedActions);
            if (failedActions.length > 0) {
                const firstError = failedActions[0].data.actionError;
                const message = firstError?.message || "One or more operations failed";
                throw new Error(message);
            }

            return {success: true};
        },
        onSuccess: () => {
            toast.success("Alert policies saved successfully");
            // onSuccess?.();
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to save alert policies");
        },
    });


    return (
        <Form
            form={form}
            className="flex flex-col gap-4"
            onSubmit={async (values) => {
                await mutation.mutateAsync(values);
            }}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Alert Policies</Label>
                    <Button
                        disabled={
                            fields.length >= notificationChannels.length ||
                            notificationChannels.length === 0
                        }
                        type="button"
                        variant="outline" size="sm" onClick={addAlertPolicy}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add
                    </Button>
                </div>

                <div className="space-y-3 w-full">
                    {organizationNotificationChannels.length === 0 ? (
                        <div className="text-muted-foreground text-sm text-center border border-dashed rounded-lg p-4">
                            No alerts policy in organization
                        </div>
                    ) : fields.length === 0 ? (
                        <div className="text-muted-foreground text-sm text-center">
                            No alert policy, create one
                        </div>
                    ) : (
                        fields.map((field, index) => (
                            <div key={field.id}>
                                <div className="flex w-full gap-3">
                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`alertPolicies.${index}.notificationChannelId`}
                                            render={({field}) => {
                                                const selectedIds = form
                                                    .watch("alertPolicies")
                                                    .map((a: AlertPolicyType) => a.notificationChannelId)
                                                    .filter(Boolean);

                                                const availableNotificationChannels = notificationChannels.filter(
                                                    (channel) =>
                                                        channel.id.toString() === field.value?.toString() ||
                                                        !selectedIds.includes(channel.id.toString())
                                                );

                                                return (
                                                    <FormItem>
                                                        <Select onValueChange={field.onChange}
                                                                value={field.value?.toString() || ""}
                                                        >

                                                            <FormControl>
                                                                <SelectTrigger className="h-10 w-full ">
                                                                    <SelectValue
                                                                        placeholder="Select notification channel"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {availableNotificationChannels.map((channel) => (
                                                                    <SelectItem key={channel.id.toString()}
                                                                                value={channel.id.toString()}>
                                                                        {channel.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="mb-2"/>
                                                    </FormItem>
                                                );
                                            }}
                                        />


                                        <FormField
                                            control={form.control}
                                            name={`alertPolicies.${index}.eventKinds`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <MultiSelect
                                                            options={EVENT_KIND_OPTIONS}
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value ?? []}
                                                            placeholder="Select event kinds"
                                                            variant="inverted"
                                                            animation={0}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />


                                    </div>

                                    <div className="flex flex-col gap-3 justify-between items-center ">
                                        <Button type="button" variant="outline"
                                                onClick={() => removeAlertPolicy(index)}>
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                        <div className="flex h-full justify-center items-center">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div tabIndex={0} className="inline-flex rounded-md">
                                                        {/*<Switch*/}
                                                        {/*    checked={true}*/}
                                                        {/*    onCheckedChange={async () => {*/}
                                                        {/*    }}*/}
                                                        {/*/>*/}


                                                        <FormField
                                                            control={form.control}
                                                            name={`alertPolicies.${index}.enabled`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Switch
                                                                            checked={field.value}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />


                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-64 text-pretty">
                                                    <div className="flex items-center gap-1.5">
                                                        <InfoIcon className="size-4"/>
                                                        <p>This is for activating the alert policy</p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                {index + 1 < fields.length && <Separator className="mt-3"/>}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex gap-4 justify-end">
                <ButtonWithLoading variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </ButtonWithLoading>
                <ButtonWithLoading isPending={false}>
                    Save
                </ButtonWithLoading>
            </div>
        </Form>
    );
};
