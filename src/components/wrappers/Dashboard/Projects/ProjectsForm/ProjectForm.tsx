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
import {ProjectSchema, ProjectType} from "@/components/wrappers/Dashboard/Projects/ProjectsForm/ProjectForm.schema";
import {
    createProjectAction,
    updateProjectAction
} from "@/components/wrappers/Dashboard/Projects/ProjectsForm/project-form.action";
import {useRouter} from "next/navigation";
import {Database, Organization, Projects} from "@prisma/client"
import {MultiSelect} from "@/components/wrappers/MultiSelect/MultiSelect";
import {toast} from "sonner";


export type projectFormProps = {
    defaultValues?: ProjectType;
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
            label: `${database.name} (${database.generatedId}) | ${database.agent.name}`,
        }));
    };

    const formatDefaultDatabases = (databases: ProjectType['databases']): string[] => {
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
        mutationFn: async (values: ProjectType) => {
            console.log(values)
            const project: Projects = isCreate ? await createProjectAction({
                data: values,
                organizationId: props.organization.id
            }) : await updateProjectAction({
                data: values,
                organizationId: props.organization.id,
                projectId: props.projectId
            });
            console.log(project)

            if (project.data.success) {
                toast.success(project.data.actionSuccess.message);
                router.push(`/dashboard/projects/${project.data.value.id}`);
                router.refresh()
            } else {
                toast.success(project.data.actionError.message);
            }


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
                                        placeholder="project-1" {...field}
                                        onChange={(e) => {
                                            const value = e.target.value.replaceAll(" ", "-").toLowerCase()
                                            field.onChange(value)
                                        }}/>
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
                        {isCreate ? `Create Project` : `Update Project`}
                    </Button>
                </Form>
            </CardContent>
        </Card>
    )
}