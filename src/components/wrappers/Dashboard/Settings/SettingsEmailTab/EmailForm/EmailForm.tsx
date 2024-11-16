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
} from "@/components/wrappers/Dashboard/Settings/SettingsEmailTab/EmailForm/email-form.schema";

export type EmailFormProps = {
    defaultValues?: EmailFormType;
}

export const EmailForm = (props: EmailFormProps) => {
    const form = useZodForm({
        schema: EmailFormSchema,
    });
    const mutation = useMutation({
        mutationFn: async (values: EmailFormType) => {

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

                        <Button>
                            Save
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}