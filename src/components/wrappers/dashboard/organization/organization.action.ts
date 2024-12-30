"use server"

import {ActionError, userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {OrganizationSchema} from "@/components/wrappers/dashboard/organization/organization.schema";
import {ServerActionResult} from "@/types/action-type";
import {Organization} from "@prisma/client";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {db} from "@/db";


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
                    organizationId: organization.id
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