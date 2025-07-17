"use client";

import {useMutation} from "@tanstack/react-query";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {OrganizationSchema} from "@/components/wrappers/dashboard/organization/organization.schema";
import {createOrganizationAction} from "@/components/wrappers/dashboard/organization/organization.action";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {authClient} from "@/lib/auth/auth-client";

export type createOrganizationModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;

};

export function CreateOrganizationModal({open, onOpenChange, onSuccess}: createOrganizationModalProps) {


    const router = useRouter();

    const form = useZodForm({
        schema: OrganizationSchema,
    });


    const mutation = useMutation({
        mutationFn: async (values: OrganizationSchema) => {
            console.log(values);

            const result = await createOrganizationAction(values);

            if (result && result.data) {
                if (result.data.success && result.data.value) {
                    onOpenChange(false);
                    await authClient.organization.setActive({organizationSlug: result.data.value.slug});
                    onSuccess?.();
                    router.replace(`/dashboard/home`);
                    // router.refresh();
                }
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                    <DialogTitle>Create a new organization</DialogTitle>
                </DialogHeader>

                <div className="sm:max-w-[375px] w-full">
                    <Form
                        form={form}
                        className="flex flex-col gap-4"
                        onSubmit={async (values) => {
                            console.log(values);
                            await mutation.mutateAsync(values);
                        }}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value.replaceAll(" ", "-").toLowerCase();
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <div className="flex items-center justify-between w-full">
                                <Button type="submit">Create</Button>
                            </div>
                        </DialogFooter>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
