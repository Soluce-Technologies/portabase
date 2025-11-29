"use server"
import {userAction} from "@/lib/safe-actions/actions";
import {z} from "zod";
import {ServerActionResult} from "@/types/action-type";
import {db} from "@/db";
import * as drizzleDb from "@/db";
import {and, eq, inArray} from "drizzle-orm";
import {withUpdatedAt} from "@/db/utils";
import {
    AlertPolicySchema
} from "@/components/wrappers/dashboard/database/alert-policy/alert-policy.schema";
import {AlertPolicy} from "@/db/schema/10_alert-policy";



export const createAlertPoliciesAction = userAction
    .schema(
        z.object({
            databaseId: z.string(),
            alertPolicies: z.array(AlertPolicySchema),
        })
    )
    .action(async ({parsedInput}): Promise<ServerActionResult<AlertPolicy[]>> => {
        try {

            const valuesToInsert = parsedInput.alertPolicies.map((policy) => ({
                databaseId: parsedInput.databaseId,
                notificationChannelId: policy.notificationChannelId,
                eventKinds: policy.eventKinds,
                enabled: policy.enabled,
            }));

            const insertedPolicies = await db
                .insert(drizzleDb.schemas.alertPolicy)
                .values(valuesToInsert)
                .returning();

            return {
                success: true,
                value: insertedPolicies,
                actionSuccess: {
                    message: `Alert policies successfully added`,
                },
            };

        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to add policies.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                },
            };
        }
    });




export const updateAlertPoliciesAction = userAction
    .schema(
        z.object({
            databaseId: z.string().min(1),
            alertPolicies: z.array(AlertPolicySchema),
        })
    )
    .action(async ({parsedInput}): Promise<ServerActionResult<AlertPolicy[]>> => {
        const {databaseId, alertPolicies} = parsedInput;

        try {

            const updatedPolicies = await db.transaction(async (tx) => {
                const results: AlertPolicy[] = [];
                for (const policy of alertPolicies) {
                    const {notificationChannelId, ...updateData} = policy;

                    const updated = await tx
                        .update(drizzleDb.schemas.alertPolicy)
                        .set(withUpdatedAt({
                            ...updateData,
                        }))
                        .where(
                            and(
                                eq(drizzleDb.schemas.alertPolicy.notificationChannelId, notificationChannelId),
                                eq(drizzleDb.schemas.alertPolicy.databaseId, databaseId)
                            )
                        )
                        .returning();

                    if (updated[0]) {
                        results.push(updated[0]);
                    }
                }

                return results;
            });

            if (updatedPolicies.length === 0) {
                return {
                    success: false,
                    actionError: {message: "No policies were updated."},
                };
            }

            return {
                success: true,
                value: updatedPolicies,
                actionSuccess: {
                    message: `Successfully updated ${updatedPolicies.length} alert policy(ies).`,
                },
            };
        } catch (error) {
            console.error("Update alert policies failed:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to update alert policies.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                },
            };
        }
    });


export const deleteAlertPoliciesAction = userAction
    .schema(
        z.object({
            databaseId: z.string().min(1),
            alertPolicies: z.array(AlertPolicySchema),
        })
    )
    .action(async ({ parsedInput }): Promise<ServerActionResult<AlertPolicy[]>> => {
        const { databaseId, alertPolicies } = parsedInput;

        try {

            const notificationChannelIds = alertPolicies.map((alertPolicy) => alertPolicy.notificationChannelId);

            const policiesToDelete = await db
                .select()
                .from(drizzleDb.schemas.alertPolicy)
                .where(
                    and(
                        eq(drizzleDb.schemas.alertPolicy.databaseId, databaseId),
                        inArray(drizzleDb.schemas.alertPolicy.notificationChannelId, notificationChannelIds)
                    )
                );

            if (policiesToDelete.length === 0) {
                return {
                    success: false,
                    actionError: { message: "No alert policies found to delete." },
                };
            }

            await db
                .delete(drizzleDb.schemas.alertPolicy)
                .where(
                    and(
                        eq(drizzleDb.schemas.alertPolicy.databaseId, databaseId),
                        inArray(drizzleDb.schemas.alertPolicy.notificationChannelId, notificationChannelIds)
                    )
                );

            return {
                success: true,
                value: policiesToDelete,
                actionSuccess: {
                    message: `Successfully deleted ${policiesToDelete.length} alert policy(ies).`,
                },
            };
        } catch (error) {
            console.error("Delete alert policies failed:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to delete alert policies.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                },
            };
        }
    });