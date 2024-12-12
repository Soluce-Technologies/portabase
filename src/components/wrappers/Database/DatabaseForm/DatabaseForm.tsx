"use client";

import {Card, CardContent} from "@/components/ui/card";
import {
    FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useZodForm
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip";
import {DatabaseSchema, DatabaseType} from "@/components/wrappers/Database/DatabaseForm/form-database.schema";

export type DatabaseFormProps = {
    defaultValues?: DatabaseType;
    databaseId?: string;
}

export const DatabaseForm = (props: DatabaseFormProps) => {

    const isCreate = !Boolean(props.defaultValues)

    const form = useZodForm({
        schema: DatabaseSchema,
        defaultValues: props.defaultValues,
    });

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: DatabaseType) => {
            console.log("values", values)

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
                            name="name"
                            disabled
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Database 1" {...field} />
                                    </FormControl>
                                    <FormDescription>Your database project name setup in agent</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dbms"
                            defaultValue=""
                            disabled
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Database type</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="PostgreSQL" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormDescription>Your database project name setup in agent</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Prod database for project 1" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormDescription>Add a short description about this database</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button>
                            {isCreate ? `Create database` : `Save database`}
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}