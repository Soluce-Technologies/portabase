"use client";

import {Card, CardContent} from "@/components/ui/card";
import {
    FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useZodForm
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip";

import {
    EmailFormSchema,
    EmailFormType
} from "@/components/wrappers/Dashboard/admin/AdminEmailTab/EmailForm/email-form.schema";
import Link from "next/link";
import {PasswordInput} from "@/components/wrappers/Auth/PaswordInput/password-input";
import {
    updateEmailSettingsAction
} from "@/components/wrappers/Dashboard/admin/AdminEmailTab/EmailForm/email-form.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export type EmailFormProps = {
    defaultValues?: EmailFormType;
}

export const EmailForm = (props: EmailFormProps) => {

    const isCreate = !Boolean(props.defaultValues)

    const form = useZodForm({
        schema: EmailFormSchema,
        defaultValues: props.defaultValues,
    });
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: EmailFormType) => {
            const updateEmailSettings = await updateEmailSettingsAction({name: "system", data: values})
            const data = updateEmailSettings?.data?.data
            if (updateEmailSettings?.serverError || !data) {
                console.log(updateEmailSettings?.serverError);
                toast.error(updateEmailSettings?.serverError);
                return;
            }
            toast.success(`Success updating email informations`);
            router.refresh()
        }
    })


    return (
        <TooltipProvider>
            <Card>
                <CardContent>

                    <Form form={form}

                          className="flex flex-col gap-4 mt-3"
                          onSubmit={async (values) => {
                              await mutation.mutateAsync(values);
                          }}
                    >
                        <FormField
                            control={form.control}
                            name="smtpFrom"
                            defaultValue=""

                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>From Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"exemple@portabase.com"} {...field} />
                                    </FormControl>
                                    <FormDescription>{"The email from where the email will be send"}</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="smtpHost"
                            defaultValue=""

                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Server Host *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"ssl0.ovh.net"} {...field} />
                                    </FormControl>
                                    <FormDescription>{"Your email server host"}</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="smtpPort"
                            defaultValue=""

                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Server Port *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"465"} {...field} />
                                    </FormControl>
                                    <FormDescription>{"Your email server port (send)"}</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="smtpPassword"
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="Password" {...field}/>
                                    </FormControl>
                                    <FormDescription>{"Your email server password"}</FormDescription>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="smtpUser"
                            defaultValue=""

                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>User Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"exemple@portabase.com"} {...field} />
                                    </FormControl>
                                    <FormDescription>{"The email server user"}</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-4">

                            <Button>
                                Save
                            </Button>
                        </div>

                    </Form>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}