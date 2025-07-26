"use server";

import { userAction } from "@/safe-actions";
import { OrganizationSchema } from "@/components/wrappers/dashboard/organization/organization.schema";
import { ServerActionResult } from "@/types/action-type";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { OrganizationFormSchema } from "@/components/wrappers/dashboard/organization/OrganizationForm/organization-form.schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {checkSlugOrganization, createOrganization, deleteOrganization} from "@/lib/auth/auth";
import {slugify} from "@/utils/slugify";
import {Organization} from "@/db/schema/02_organization";
import * as drizzleDb from "@/db";

export const createOrganizationAction = userAction.schema(OrganizationSchema).action(async ({ parsedInput }): Promise<ServerActionResult<Organization>> => {
    try {
        const slug = slugify(parsedInput.name);
        if (!await checkSlugOrganization(slug)) {
            return {
                success: false,
                actionError: {
                    message: "Slug is already taken",
                    status: 500,
                    messageParams: { message: "Error creating the organization" },
                },
            };
        }

        let createdOrganization: Organization;

        try {
            createdOrganization = await createOrganization(parsedInput.name, slug) as unknown as Organization;
        } catch (authError: any) {
            console.error("Auth deletion failed:", authError);
            return {
                success: false,
                actionError: {
                    message: authError.message || "Authentication service error.",
                    status: authError.status || 500,
                    cause: "auth_error",
                    messageParams: { message: authError.message },
                },
            };
        }

        return {
            success: true,
            value: createdOrganization,
            actionSuccess: {
                message: "Organization has been successfully created.",
                messageParams: { organizationId: createdOrganization!.id },
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

            const organization = await db.select().from(drizzleDb.schemas.organization).where(eq(drizzleDb.schemas.organization.id, parsedInput.organizationId)).execute();

            if (organization.length === 0) {
                throw new Error("Organization not found.");
            }

            const existingItemIds = organization[0].users.map((user) => user.userId);
            const usersToAdd = newUserList.filter((id) => !existingItemIds.includes(id));
            const usersToRemove = existingItemIds.filter((id) => !newUserList.includes(id));

            if (usersToAdd.length > 0) {
                await db
                    .insert(drizzleDb.schemas.organization)
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

export const deleteOrganizationAction = userAction.schema(z.string()).action(
    async ({ parsedInput, ctx }): Promise<ServerActionResult<Organization>> => {
        try {
            const org = await db.query.organization.findFirst({
                where: eq(drizzleDb.schemas.organization.slug, parsedInput),
            });

            if (!org) {
                return {
                    success: false,
                    actionError: {
                        message: "Organization not found.",
                        status: 404,
                        cause: "not_found",
                    },
                };
            }

            let deletedOrganization: Organization;

            try {
                deletedOrganization = await deleteOrganization(org.id) as Organization;
            } catch (authError: any) {
                console.error("Auth deletion failed:", authError);
                return {
                    success: false,
                    actionError: {
                        message: authError.message || "Authentication service error.",
                        status: authError.status || 500,
                        cause: "auth_error",
                        messageParams: { message: authError.message },
                    },
                };
            }

            return {
                success: true,
                value: deletedOrganization,
                actionSuccess: {
                    message: "Organization has been successfully deleted.",
                    messageParams: { organizationId: deletedOrganization.id },
                },
            };
        } catch (error) {
            console.error("Unexpected error in deleteOrganizationAction:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to delete organization due to a server error.",
                    status: 500,
                    cause: "server_error",
                    messageParams: { message: "Internal server error while deleting the organization" },
                },
            };
        }
    }
);
