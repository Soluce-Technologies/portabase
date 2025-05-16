"use server";

import { userAction } from "@/safe-actions";
import { OrganizationSchema } from "@/components/wrappers/dashboard/organization/organization.schema";
import { ServerActionResult } from "@/types/action-type";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { OrganizationFormSchema } from "@/components/wrappers/dashboard/organization/OrganizationForm/organization-form.schema";
import { db } from "@/db";
import { Organization, organization as drizzleOrganization, organizationMember as drizzleOrganizationMember } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkSlugOrganization, createOrganization } from "@/lib/auth/auth";

export const createOrganizationAction = userAction.schema(OrganizationSchema).action(async ({ parsedInput }): Promise<ServerActionResult<Organization>> => {
    try {
        if (!checkSlugOrganization(parsedInput.slug)) {
            return {
                success: false,
                actionError: {
                    message: "Slug is already taken",
                    status: 500,
                    messageParams: { message: "Error creating the organization" },
                },
            };
        }

        const organization = await createOrganization(parsedInput.name, parsedInput.slug);

        return {
            success: true,
            value: organization!,
            actionSuccess: {
                message: "Organization has been successfully created.",
                messageParams: { organizationId: organization!.id },
            },
        };
    } catch (error) {
        console.error("Error creating organization:", error);
        return {
            success: false,
            actionError: {
                message: "Failed to create organization.",
                status: 500,
                messageParams: { message: "Error creating the organization" },
            },
        };
    }
});

export const updateOrganizationAction = userAction
    .schema(
        z.object({
            data: OrganizationFormSchema,
            organizationId: z.string(),
        })
    )
    .action(async ({ parsedInput }): Promise<ServerActionResult<Organization>> => {
        try {
            const newUserList = parsedInput.data.users;

            const organization = await db.select().from(organization).where(eq(organization.id, parsedInput.organizationId)).execute();

            if (organization.length === 0) {
                throw new Error("Organization not found.");
            }

            const existingItemIds = organization[0].users.map((user) => user.userId);
            const usersToAdd = newUserList.filter((id) => !existingItemIds.includes(id));
            const usersToRemove = existingItemIds.filter((id) => !newUserList.includes(id));

            if (usersToAdd.length > 0) {
                await db
                    .insert(userOrganization)
                    .values(
                        usersToAdd.map((userId) => ({
                            userId,
                            organizationId: organization[0].id,
                            role: "member",
                        }))
                    )
                    .execute();
            }

            if (usersToRemove.length > 0) {
                await db.delete().from(userOrganization).where(inArray(userOrganization.userId, usersToRemove)).execute();
            }

            const updatedOrganization = await db
                .update(organization)
                .set({
                    name: parsedInput.data.name,
                    slug: parsedInput.data.slug,
                })
                .where(eq(organization.id, parsedInput.organizationId))
                .returning()
                .execute();

            return {
                success: true,
                value: updatedOrganization[0],
                actionSuccess: {
                    message: "Organization has been successfully updated.",
                    messageParams: { organizationId: updatedOrganization[0].id },
                },
            };
        } catch (error) {
            console.error("Error updating organization:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to update organization.",
                    status: 500,
                    cause: error.message ?? "Unknown error",
                    messageParams: { message: "Error updating the organization" },
                },
            };
        }
    });

export const deleteOrganizationAction = userAction.schema(z.string()).action(async ({ parsedInput, ctx }): Promise<ServerActionResult<Organization>> => {
    try {
        const uuid = uuidv4();
        const organization = await db.select().from(organization).where(eq(organization.slug, parsedInput)).execute();

        if (organization.length === 0) {
            throw new Error("Organization not found.");
        }

        const updatedOrganization = await db
            .update(organization)
            .set({
                name: `${organization[0].name}-${uuid}`,
                slug: `${organization[0].slug}-${uuid}`,
                deleted: true,
            })
            .where(eq(organization.id, organization[0].id))
            .returning()
            .execute();

        return {
            success: true,
            value: updatedOrganization[0],
            actionSuccess: {
                message: "Organization has been successfully deleted.",
                messageParams: { organizationId: updatedOrganization[0].id },
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
                messageParams: { message: "Error deleting the organization" },
            },
        };
    }
});
