"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {ProjectSchema} from "@/components/wrappers/project/ProjectForm.schema";
import {createProjectAction} from "@/components/wrappers/project/ProjectForm.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export type projectFormProps = {
    defaultValues?: ProjectSchema;
}

export const ProjectForm = (props: projectFormProps) => {

    const router = useRouter();

    const {data: session} = useSession()
    console.log("organization", session)

    const form = useZodForm({
        schema: ProjectSchema,
    });

    const mutation = useMutation({
        mutationFn: async (values: ProjectSchema) => {

            const {data, validationErrors} = await createProjectAction({...values, organizationId: organization?.id});

            if (data) {
                toast.success(`Success`);
                router.push(`/dashboard/projects/${data.id}`);
                router.refresh()
            }

            if (validationErrors) {
                toast.success(`Error`);

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
                                        placeholder="project-1" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button>
                        Create Project
                    </Button>
                </Form>
            </CardContent>
        </Card>
    )
}