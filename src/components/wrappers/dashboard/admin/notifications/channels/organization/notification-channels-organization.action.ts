"use server"
import {userAction} from "@/lib/safe-actions/actions";
import {z} from "zod";
import {ServerActionResult} from "@/types/action-type";
import {db} from "@/db";
import {and, eq, inArray} from "drizzle-orm";
import * as drizzleDb from "@/db";
import {NotificationChannelWith} from "@/db/schema/09_notification-channel";


export const updateNotificationChannelsOrganizationAction = userAction
    .schema(
        z.object({
            data: z.array(z.string()),
            notificationChannelId: z.string(),
        })
    )
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<null>> => {
        try {
            const organizationsIds = parsedInput.data;

            const notificationChannel = await db.query.notificationChannel.findFirst({
                where: eq(drizzleDb.schemas.notificationChannel.id, parsedInput.notificationChannelId),
                with: {
                    organizations: true,
                }
            }) as NotificationChannelWith;


            if (!notificationChannel) {
                return {
                    success: false,
                    actionError: {
                        message: "Notification channel not found.",
                        status: 404,
                        cause: "not_found",
                    },
                };
            }

            const existingItemIds = notificationChannel.organizations.map((organization) => organization.organizationId);

            const organizationsToAdd = organizationsIds.filter((id) => !existingItemIds.includes(id));
            const organizationsToRemove = existingItemIds.filter((id) => !organizationsIds.includes(id));

            if (organizationsToAdd.length > 0) {
                for (const organizationToAdd of organizationsToAdd) {
                    await db.insert(drizzleDb.schemas.organizationNotificationChannel).values({
                        organizationId: organizationToAdd,
                        notificationChannelId: parsedInput.notificationChannelId
                    });
                }
            }
            if (organizationsToRemove.length > 0) {
                await db.delete(drizzleDb.schemas.organizationNotificationChannel).where(and(inArray(drizzleDb.schemas.organizationNotificationChannel.organizationId, organizationsToRemove), eq(drizzleDb.schemas.organizationNotificationChannel.notificationChannelId, parsedInput.notificationChannelId))).execute();

            }

            return {
                success: true,
                value: null,
                actionSuccess: {
                    message: "Notification channel organizations has been successfully updated.",
                    messageParams: {notificationChannelId: parsedInput.notificationChannelId},
                },
            };
        } catch (error) {
            console.error("Error updating notification channel:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to update notification channel.",
                    status: 500,
                    cause: "server_error",
                    messageParams: {message: "Error updating the notification channel"},
                },
            };
        }
    });
