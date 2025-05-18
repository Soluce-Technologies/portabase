"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MultiSelect } from "@/components/wrappers/common/multiselect/multi-select";
import { OrganizationFormSchema, OrganizationFormType } from "@/components/wrappers/dashboard/organization/OrganizationForm/organization-form.schema";
import { updateOrganizationAction } from "@/components/wrappers/dashboard/organization/organization.action";
import { toast } from "sonner";
import {Member, Organization} from "better-auth/plugins";

export type organizationFormProps = {
    defaultValues?: Organization;
    members: Member[];
};

export const OrganizationForm = (props: organizationFormProps) => {
    const router = useRouter();
    const isCreate = !Boolean(props.defaultValues);

    const formatUsersList = (members: Member[]) => {
        return members.map((member) => ({
            value: member.id,
            label: `${member.user.name} | ${member.user.email}`,
        }));
    };

    const formatDefaultUsers = (members: OrganizationFormType["members"]): string[] => {
        console.log(members);
        return members.map((member) => member.userId);
    };

    const formattedDefaultValues = {
        ...props.defaultValues,
        users: !isCreate ? formatDefaultUsers(props.defaultValues?.members) : [],
    };

    const form = useZodForm({
        schema: OrganizationFormSchema,
        defaultValues: formattedDefaultValues,
    });

    const mutation = useMutation({
        mutationFn: async (values: OrganizationFormType) => {
            console.log(values);
            // const organization = await updateOrganizationAction({ data: values, organizationId: props.defaultValues.id });
            // console.log(organization);
            // if (organization.data.success) {
            //     // toast.success(organization.data.actionSuccess.message);
            //     // router.push(`/dashboard/${organization.data.value.slug}/settings`);
            //     // router.refresh();
            // } else {
            //     // toast.success(organization.data.actionError.message);
            // }
        },
    });

    return (
        <Card>
            <CardHeader></CardHeader>
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
                        defaultValue=""
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Organization 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        defaultValue=""
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="project-1"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value.replaceAll(" ", "-").toLowerCase();
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="users"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Databases</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={formatUsersList(props.members)}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? []}
                                        placeholder="Select databases"
                                        variant="inverted"
                                        animation={2}
                                        // maxCount={100}
                                    />
                                </FormControl>
                                <FormDescription>Select users you want to add to this organization</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button>{isCreate ? `Create Organization` : `Update Organization`}</Button>
                </Form>
            </CardContent>
        </Card>
    );
};
