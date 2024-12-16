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
import {AgentSchema, AgentType} from "@/components/wrappers/dashboard/agent/AgentForm/agent-form.schema";
import {toast} from "sonner";
import {createAgentAction, updateAgentAction} from "@/components/wrappers/dashboard/agent/AgentForm/agent-form.action";

export type agentFormProps = {
    defaultValues?: AgentType;
    agentId?: string;
}

export const AgentForm = (props: agentFormProps) => {

    const isCreate = !Boolean(props.defaultValues)
    // const defaultValues = isCreate ? {slug: ""} : props.defaultValues

    const form = useZodForm({
        schema: AgentSchema,
        defaultValues: props.defaultValues,
    });

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: AgentType) => {
            console.log("values", values)

            const createAgent = isCreate ? await createAgentAction(values) : await updateAgentAction({
                id: props.agentId ?? "-",
                data: values
            });

            const data = createAgent?.data?.data
            if (createAgent?.serverError || !data) {
                console.log(createAgent?.serverError);
                toast.error(createAgent?.serverError);
                return;
            }
            toast.success(`Success`);
            router.push(`/dashboard/agents/${data.id}`);
            router.refresh()
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
                            defaultValue=""
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Agent 1" {...field} />
                                    </FormControl>
                                    <FormDescription>Your agent project name</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            defaultValue=""

                            name="slug"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="agent-1" {...field}
                                            onChange={(e) => {
                                                const value = e.target.value.replaceAll(" ", "-").toLowerCase()
                                                field.onChange(value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>The slug is used in the url of the agent</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            defaultValue=""

                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='This agent is for the client exemple.com' {...field}
                                            value={field.value ?? ""}/>
                                    </FormControl>
                                    <FormDescription>Enter your project agent description</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button>
                            {isCreate ? `Create agent` : `Save agent`}
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}