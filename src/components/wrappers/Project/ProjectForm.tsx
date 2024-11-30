"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useZodForm
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {ProjectSchema} from "@/components/wrappers/Project/ProjectForm.schema";
import {createProjectAction} from "@/components/wrappers/Project/ProjectForm.action";
import {useRouter} from "next/navigation";
import {Database, Organization} from "@prisma/client"
import {MultiSelect} from "@/components/wrappers/MultiSelect/MultiSelect";
import {ZodString} from "zod";


export type projectFormProps = {
    defaultValues?: ProjectSchema;
    databases: Database[],
    organization: Organization,
    projectId?: string;

}

export const ProjectForm = (props: projectFormProps) => {

    const router = useRouter();
    const isCreate = !Boolean(props.defaultValues)


    const formatDatabasesList = (databases: Database[]) => {
        return databases.map(database => ({
            value: database.id,
            label: `${database.name} | ${database.generatedId}`,
        }));
    };

    const formatDefaultDatabases = (databases: ProjectSchema["databases"]): string[] => {
        return databases.map(database => database.id);
    };

    const formattedDefaultValues = {
        ...props.defaultValues,
        databases: !isCreate ? formatDefaultDatabases(props.defaultValues?.databases) : []
    }


    const form = useZodForm({
        schema: ProjectSchema,
        defaultValues: formattedDefaultValues,

    });

    const mutation = useMutation({
        mutationFn: async (values: ProjectSchema) => {
            console.log(values)
            const projectCreated = await createProjectAction({data: values, organizationId: props.organization.id});
            console.log(projectCreated)
            //
            // if (data) {
            //     toast.success(`Success`);
            //     router.push(`/dashboard/projects/${data.id}`);
            //     router.refresh()
            // }
            //
            // if (validationErrors) {
            //     toast.success(`Error`);
            //
            // }


        }
    })

    return (
        <Card>
            <CardHeader>

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
                        defaultValue=""
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Project 1" {...field} />
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
                                        placeholder="project-1" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="databases"
                        render={({field}) => (
                                <FormItem>
                                    <FormLabel>Databases</FormLabel>
                                    <FormControl>

                                        <MultiSelect
                                            options={formatDatabasesList(props.databases)}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value ?? []}
                                            placeholder="Select databases"
                                            variant="inverted"
                                            animation={2}
                                            // maxCount={100}
                                        />
                                    </FormControl>
                                    <FormDescription>Select databases you want to add to this project</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }
                    />
                    <Button>
                        Create Project
                    </Button>
                </Form>
            </CardContent>
        </Card>
    )
}