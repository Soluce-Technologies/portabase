"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserSchema, UserType } from "@/components/wrappers/dashboard/profile/UserForm/user-form.schema";
import { toast } from "sonner";
import { updateUserAction } from "@/components/wrappers/dashboard/profile/UserForm/user-form.action";

export type userFormProps = {
    defaultValues?: UserType;
    userId?: string;
};

export const UserForm = (props: userFormProps) => {
    const isCreate = !Boolean(props.defaultValues);

    const form = useZodForm({
        schema: UserSchema,
        defaultValues: props.defaultValues,
    });

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: UserType) => {
            console.log("values", values);
            console.log(props.userId);
            const updateUser = await updateUserAction({
                id: props.userId ?? "-",
                data: values,
            });

            const data = updateUser?.data?.data;
            if (updateUser?.serverError || !data) {
                toast.error(updateUser?.serverError);
                return;
            }

            toast.success(`Profile updated successfully.`);
            router.push(`/dashboard/profile`);
            router.refresh();
        },
    });

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Your informations</CardDescription>
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Your Name"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"exemple@portabase.com"} disabled {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button>{isCreate ? `` : `Save`}</Button>
                    </Form>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};
