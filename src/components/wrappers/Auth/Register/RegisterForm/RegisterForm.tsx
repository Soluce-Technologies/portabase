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
import {TooltipProvider, TooltipTrigger, Tooltip, TooltipContent} from "@/components/ui/tooltip";
import {RegisterSchema, RegisterType} from "@/components/wrappers/Auth/Register/RegisterForm/register-form.schema";
import {registerUserAction} from "@/components/wrappers/Auth/Register/RegisterForm/register-form.action";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {Info} from "lucide-react";
import {PasswordInput} from "@/components/wrappers/PaswordInput/password-input";

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

                    <div className="grid gap-2 text-center mb-2">
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your informations bellow to register
                        </p>
                    </div>
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
                                            placeholder="exemple@portabase.com" {...field} />
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

                                    <FormLabel className="flex">Password
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="ml-3" size="15"/>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p> Min. 8 characters, 1 uppercase (A-Z), 1 lowercase (a-z), 1 number (0-9), 1 special character (!, @, etc.)</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </FormLabel>

                                    {/*<div className="flex items-center">*/}
                                    {/*    <FormLabel>Password</FormLabel>*/}
                                    {/*    <Link*/}
                                    {/*        href="/forgot-password"*/}
                                    {/*        className="ml-auto inline-block text-sm underline"*/}
                                    {/*    >*/}
                                    {/*        Forgot your password?*/}
                                    {/*    </Link>*/}
                                    {/*</div>*/}


                                    <FormControl>
                                        <PasswordInput placeholder="Your password" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>

                                    <FormLabel>Password Confirmation</FormLabel>

                                    {/*<div className="flex items-center">*/}
                                    {/*    <FormLabel>Password</FormLabel>*/}
                                    {/*    <Link*/}
                                    {/*        href="/forgot-password"*/}
                                    {/*        className="ml-auto inline-block text-sm underline"*/}
                                    {/*    >*/}
                                    {/*        Forgot your password?*/}
                                    {/*    </Link>*/}
                                    {/*</div>*/}


                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Conform your password" {...field} />
                                    </FormControl>
                                    {/*<FormDescription>{t('tabs.general.data.name.description')}</FormDescription>*/}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button>
                            Sign up
                        </Button>
                        {/*<div className="mt-4 text-center text-sm">*/}
                        {/*    Don&apos;t have an account?{" "}*/}
                        {/*    /!*<Link to="#" className="underline">*!/*/}
                        {/*    /!*    Sign up*!/*/}
                        {/*    /!*</Link>*!/*/}
                        {/*</div>*/}
                    </Form>

                </CardContent>
            </Card>
        </TooltipProvider>
    )
}