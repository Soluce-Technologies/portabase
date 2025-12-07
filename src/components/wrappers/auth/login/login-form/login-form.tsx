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
import {signIn} from "@/lib/auth/auth-client";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator";

export type loginFormProps = {
    defaultValues?: LoginType;
    authGoogleEnabled: boolean;
};

export const LoginForm = (props: loginFormProps) => {
    const router = useRouter();

    const form = useZodForm({
        schema: LoginSchema,
    });

    const [urlParams] = useState(() =>
        new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
    );

    useEffect(() => {
        const error = urlParams.get("error");
        if (error?.includes("pending")) {
            toast.error("Your account is not active.");
            urlParams.delete("error");
            window.history.replaceState({}, document.title, window.location.pathname + "?" + urlParams.toString());
        }
    }, [urlParams]);

    const mutation = useMutation({
        mutationFn: async (values: LoginType) => {
            try {
                const callbackURL =
                    urlParams.get("redirect")?.startsWith("/")
                        ? urlParams.get("redirect")
                        : "/dashboard/profile";

                const {error} = await signIn.email({
                    email: values.email,
                    password: values.password,
                    callbackURL: callbackURL ?? "/dashboard/profile",
                });

                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success("Login success");
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

    const availableProviders: SocialProviderType[] = [];

    if (props.authGoogleEnabled) {
        availableProviders.push({
            id: "google",
            name: "Google",
            icon: <Icon icon="logos:google-icon" width="25" height="25"/>,
        });
    }

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <div className="grid gap-2 text-center mb-2">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information below to login
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
                        <FormField
                            control={form.control}
                            name="password"
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <div className="text-center text-sm">
                                            <Link href="/forgot-password" className="hover:underline">
                                                Forgot your password ?
                                            </Link>
                                        </div>

                                    </div>
                                    <FormControl>
                                        <PasswordInput
                                            autoComplete="current-password"
                                            placeholder="Your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Signing in..." : "Sign in"}
                        </Button>
                    </Form>

                    {availableProviders.length > 0 && (
                        <div className="relative my-4 flex items-center justify-center overflow-hidden">
                            <Separator/>
                            <div className="px-2 text-center bg-card text-sm">OR</div>
                            <Separator/>
                        </div>
                    )}

                    <SocialAuthButton
                        callBackURL={urlParams.get("redirect") ?? "/dashboard/profile"}
                        providers={availableProviders}
                    />

                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account ?{" "}
                        <Link href="/register" className="underline">
                            Sign up
                        </Link>
                    </div>

                </CardContent>
            </Card>
        </TooltipProvider>
    );
};
