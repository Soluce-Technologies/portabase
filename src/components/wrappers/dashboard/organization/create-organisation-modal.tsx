"use client"

import {useMutation} from "@tanstack/react-query";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {OrganizationSchema} from "@/components/wrappers/dashboard/organization/organization.schema";
import {createOrganizationAction} from "@/components/wrappers/dashboard/organization/organization.action";
import {useRouter} from "next/navigation";

export type createOrganizationModalProps = {
    children: any
}


export function CreateOrganizationModal(props: createOrganizationModalProps) {

    const {children} = props;

    const router = useRouter()

    const form = useZodForm({
        schema: OrganizationSchema,
    });

    const mutation = useMutation({
        mutationFn: async (values: OrganizationSchema) => {
            const result = await createOrganizationAction(values)
            router.refresh()
        }
    })


    return (
        <Dialog>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] w-full">

                <DialogHeader>
                    <DialogTitle>Create a new organization</DialogTitle>
                </DialogHeader>

                <div className="sm:max-w-[375px] w-full">
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </Form>
                </div>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <Button type="submit">Create</Button>
                    </div>
                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}