"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useZodForm
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip";
import {RegisterSchema, RegisterType} from "@/components/wrappers/Auth/Register/RegisterForm/register-form.schema";
import {registerUserAction} from "@/components/wrappers/Auth/Register/RegisterForm/register-form.action";

export type registerFormProps = {
    defaultValues?: RegisterType;
}

export const RegisterForm = (props: registerFormProps) => {

    const form = useZodForm({
        schema: RegisterSchema,
    });

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: RegisterType) => {
            console.log(values)
            const createUser = await registerUserAction(values);
            const data = createUser?.data?.data
            if (createUser?.serverError || !data) {
                console.log(createUser?.serverError);
                toast.error(createUser?.serverError);
                return;
            }
            toast.success(`Success`);
            router.push(`/login`);
            router.refresh()
        }
    })

    return (
        <TooltipProvider>

            <Card>
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form form={form}
                          className="flex flex-col gap-4"
                          onSubmit={async (values) => {
                              await mutation.mutateAsync(values);
                          }}
                    >

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your name" {...field} />
                                            </FormControl>
                                            {/*<FormDescription>{t('tabs.general.data.name.description')}</FormDescription>*/}
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your email" {...field} />
                                    </FormControl>
                                    {/*<FormDescription>{t('tabs.general.data.name.description')}</FormDescription>*/}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your password" {...field} />
                                    </FormControl>
                                    {/*<FormDescription>{t('tabs.general.data.name.description')}</FormDescription>*/}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button>
                            Sign up
                        </Button>
                    </Form>

                </CardContent>
            </Card>
        </TooltipProvider>
    )
}