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
import {PasswordInput} from "@/components/wrappers/auth/password-input/password-input";
import {LoginSchema, LoginType} from "@/components/wrappers/auth/login/login-form/login-form.schema";
import {SocialAuthButton, SocialProviderType} from "@/components/wrappers/auth/login/button-auth/social-auth-button";
import {signIn} from "@/lib/auth/auth-client";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import {env} from "@/env.mjs";

export type loginFormProps = {
    defaultValues?: LoginType;
};

export const LoginForm = (props: loginFormProps) => {
    const router = useRouter();

    const form = useZodForm({
        schema: LoginSchema,
    });

    const mutation = useMutation({
        mutationFn: async (values: LoginType) => {
            const {error} = await signIn.email(values, {
                onSuccess: () => {
                    toast.success("Login success");
                    router.push("/dashboard/profile");
                },
            });
            if (error) {
                toast.error(error.message);
            }
        },
    });

    const availableProviders: SocialProviderType[] = [];

    if (env.NEXT_PUBLIC_GOOGLE_AUTH) {
        availableProviders.push(
            {
                id: "google",
                name: "Google",
                icon: <Icon icon={"logos:google-icon"} width="25" height="25"/>,
            },
        )
    }


    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <div className="grid gap-2 text-center mb-2">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">Enter your informations below to login</p>
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
                                        <Input autoComplete="email webauthn"
                                               placeholder="exemple@portabase.io" {...field} />
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
                                    <div className="flex items-center">
                                        <FormLabel>Password</FormLabel>
                                        {/*  <Link href={"/forgot-password"} className="ml-auto inline-block text-sm underline">
                                            Forgot your password?
                                        </Link>*/}
                                    </div>
                                    <FormControl>
                                        <PasswordInput autoComplete="current-password webauthn"
                                                       placeholder="Your password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button>Sign in</Button>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href={"/register"} className="underline">
                                Sign up
                            </Link>
                        </div>
                    </Form>
                    <SocialAuthButton providers={availableProviders}/>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};
