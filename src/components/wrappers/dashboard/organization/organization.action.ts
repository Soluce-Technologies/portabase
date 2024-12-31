"use server"

import {ActionError, userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {OrganizationSchema} from "@/components/wrappers/dashboard/organization/organization.schema";
import {ServerActionResult} from "@/types/action-type";
import {Organization} from "@prisma/client";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {db} from "@/db";
import {
    OrganizationFormSchema
} from "@/components/wrappers/dashboard/organization/OrganizationForm/organization-form.schema";
import {ProjectSchema} from "@/components/wrappers/dashboard/projects/ProjectsForm/ProjectForm.schema";


const verifySlugUniqueness = async (slug: string) => {
    const slugExists = await prisma.organization.count({
        where: {
            slug: slug
        },
    })

    if (slugExists) {
        throw new ActionError("Slug already exists.");
    }
}


export const createOrganizationAction = userAction
    .schema(OrganizationSchema)
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Organization>> => {

        try {

            await verifySlugUniqueness(parsedInput.slug)

            const organization = await prisma.organization.create({
                data: {
                    ...parsedInput
                }
            })

            await prisma.userOrganization.create({
                data: {
                    userId: ctx.user.id,
                    organizationId: organization.id,
                    role: "admin"
                },
            });

            return {
                success: true,
                value: organization,
                actionSuccess: {
                    message: "Organization has been successfully created.",
                    messageParams: {organizationId: organization.id},
                },
            };

        } catch (error) {
            console.error("Error creating organization:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to create organization.",
                    status: 500,
                    cause: error.message ?? "Unknown error",
                    messageParams: {message: "Error creating the organization"},
                },
            };
        }

    });




export const updateOrganizationAction = userAction
    .schema(
        z.object({
            data: OrganizationFormSchema,
            organizationId: z.string()
        }))
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Organization>> => {
        try {

            const newUserList = parsedInput.data.users

            const organization = await prisma.organization.findFirst({
                where:{
                    id: parsedInput.organizationId,
                },
                include: {
                    users : {}
                }
            })

            const existingItemIds = organization.users.map((user) => user.userId);
            const usersToAdd = newUserList.filter(
                (id) => !existingItemIds.includes(id)
            );
            const usersToRemove = existingItemIds.filter(
                (id) => !newUserList.includes(id)
            );

            console.log(usersToAdd);
            console.log(usersToRemove);


            if (usersToAdd.length > 0) {

                await prisma.userOrganization.createMany({
                    data: usersToAdd.map((userId) => ({
                        userId: userId,
                        organizationId: organization.id,
                        role: "member"
                    })),
                    skipDuplicates: true, // Optional: to avoid duplicate insertion errors
                });
            }
            if (usersToRemove.length > 0) {
                await prisma.userOrganization.deleteMany({
                    where: {
                        userId: { in: usersToRemove },
                    },

                });
            }

            const updatedOrganization = await prisma.organization.update({
                where:{
                    id: organization.id
                },
                data:{
                    name: parsedInput.data.name,
                    slug: parsedInput.data.slug,
                }
            })


            return {
                success: true,
                value: updatedOrganization,
                actionSuccess: {
                    message: "Organization has been successfully updated.",
                    messageParams: {organizationId: updatedOrganization.id},
                },
            };

        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to update organization.",
                    status: 500,
                    cause: error.message ?? "Unknown error",
                    messageParams: {message: "Error updating the organization"},
                },
            };
        }

    });





export const deleteOrganizationAction = userAction
    .schema(z.string())
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Organization>> => {
        console.log(parsedInput);
        try {

            const uuid = uuidv4()
            const organization = await db.organization.findFirst({
                where: {
                    slug: parsedInput,
                }
            })
            console.log(organization);
            const organizationUpdated = await db.organization.update({
                where: {
                    id: parsedInput,
                },
                data: {
                    name: `${organization.name}-${uuid}`,
                    slug: `${organization.slug}-${uuid}`,
                    deleted : true

                }
            })


            return {
                success: true,
                value: organizationUpdated,
                actionSuccess: {
                    message: "Organization has been successfully deleted.",
                    messageParams: {organizationId: organizationUpdated.id},
                },
            };

        } catch (error) {
            console.error("Error deleting organization:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to delete organization.",
                    status: 500,
                    cause: error.message ?? "Unknown error",
                    messageParams: {message: "Error deleting the organization"},
                },
            };
        }

    });