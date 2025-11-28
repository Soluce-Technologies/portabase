"use client";

import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm} from "@/components/ui/form";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {Input} from "@/components/ui/input";
import {
    NotificationChannelFormSchema, NotificationChannelFormType
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-form.schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    addNotificationChannelAction, updateNotificationChannelAction
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-form.action";
import {toast} from "sonner";
import {OrganizationWithMembers} from "@/db/schema/03_organization";
import {
    NotifierSmtpForm
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/providers/notifier-smtp.form";
import {
    NotifierSlackForm
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/providers/notifier-slack.form";
import {Button} from "@/components/ui/button";
import {NotificationChannel} from "@/db/schema/09_notification-channel";
import {
    NotifierTestChannelButton
} from "@/components/wrappers/dashboard/common/notifier/notifier-form/notifier-test-channel-button";
import {useEffect} from "react";

type NotifierFormProps = {
    onSuccessAction?: () => void;
    organization?: OrganizationWithMembers;
    defaultValues?: NotificationChannel
};

export const NotifierForm = ({onSuccessAction, organization, defaultValues}: NotifierFormProps) => {

    const isCreate = !Boolean(defaultValues);
    const router = useRouter();
    const form = useZodForm({
        schema: NotificationChannelFormSchema,
        // @ts-ignore
        defaultValues: {...defaultValues},
    });

    useEffect(() => {
        form.reset(defaultValues ? {...defaultValues} : {});
    }, [defaultValues]);

    const mutationCreateOrganisation = useMutation({
        mutationFn: async (values: NotificationChannelFormType) => {

            const payload = {
                data: values,
                ...(organization && {organizationId: organization.id}),
                ...((defaultValues && {notificationChannelId: defaultValues.id}))
            };

            // @ts-ignore
            const result = isCreate ? await addNotificationChannelAction(payload) : await updateNotificationChannelAction(payload);
            const inner = result?.data;

            if (inner?.success) {
                toast.success(inner.actionSuccess?.message);
                isCreate && onSuccessAction?.();
                router.refresh();
            } else {
                toast.error(inner?.actionError?.message);
                isCreate && onSuccessAction?.();
            }
        }
    });

    const provider = form.watch("provider");

    return (
        <Form
            form={form}
            className="flex flex-col gap-4"
            onSubmit={async (values) => {
                await mutationCreateOrganisation.mutateAsync(values);
            }}
        >
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Channel Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., Primary email, Team Slack" value={field.value ?? ""}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="provider"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={(value) => {
                                    form.setValue("config", {});
                                    field.onChange(value);
                                }}
                                value={field.value || ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select provider"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="smtp">SMTP (Email)</SelectItem>
                                    <SelectItem value="slack">Slack</SelectItem>
                                    {/*<SelectItem value="curl">Curl</SelectItem>*/}
                                    {/*<SelectItem value="webhook">Webhook</SelectItem>*/}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {provider === "smtp" && (
                <NotifierSmtpForm form={form}/>
            )}

            {provider === "slack" && (
                <NotifierSlackForm form={form}/>
            )}


            <div className="flex justify-between">
                <div>
                    {defaultValues && (
                        <NotifierTestChannelButton notificationChannel={defaultValues}/>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onSuccessAction?.();
                            form.reset();
                        }}
                    >
                        Cancel
                    </Button>
                    <ButtonWithLoading isPending={mutationCreateOrganisation.isPending}>
                        {isCreate ? "Add" : "Save"} Channel
                    </ButtonWithLoading>
                </div>

            </div>
        </Form>
    );
};




