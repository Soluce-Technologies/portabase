"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useMutation} from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip";
import Link from "next/link";
import {PasswordInput} from "@/components/ui/password-input";
import {LoginSchema, LoginType} from "@/components/wrappers/auth/login/login-form/login-form.schema";
import {SocialAuthButton, SocialProviderType} from "@/components/wrappers/auth/login/button-auth/social-auth-button";
import {authClient, signIn} from "@/lib/auth/auth-client";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator";
import {
    ForgotPasswordSchema,
    ForgotPasswordType
} from "@/components/wrappers/auth/forgot-password/forgot-password.schema";
import {ArrowLeft} from "lucide-react";
import {getServerUrl} from "@/utils/get-server-url";

export type ForgotPasswordFormProps = {};

export const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const router = useRouter();

    const form = useZodForm({
        schema: ForgotPasswordSchema,
    });


    const mutation = useMutation({
        mutationFn: async (values: ForgotPasswordType) => {
            try {
                const {data, error} = await authClient.requestPasswordReset({
                    email: values.email,
                    redirectTo: `${getServerUrl()}/reset-password`,
                });
                if (error) {
                    toast.error(error.message);
                } else {
                    // @ts-ignore
                    toast.success(data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error("Unexpected client error during login");
            }
        },
        onError: (err: any) => {
            toast.error(err.message || "Client error");
        },
    });

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <div className="grid gap-2 text-center mb-2">
                        <h1 className="text-3xl font-bold">Forgot Password</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email to reset your password
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form
                        form={form}
                        className="flex flex-col gap-4"
                        onSubmit={async (values) => {
                            await mutation.mutateAsync(values);
                        }}
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="email"
                                            placeholder="example@portabase.io"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={mutation.isPending}>
                            Send reset link
                        </Button>
                    </Form>

                    <div className="mt-4 text-center text-sm flex items-center justify-center gap-1">
                        <ArrowLeft size={14} className="text-gray-400"/>
                        <Link href="/login" className="underline">
                            Go back
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};
