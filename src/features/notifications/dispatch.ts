"use server"
// src/notifications/dispatch.ts
import {eq} from 'drizzle-orm';
import {dispatchViaProvider} from './providers';
import type {EventPayload, DispatchResult} from './types';
import * as drizzleDb from "@/db";
import {db} from "@/db";
import {notificationLog} from "@/db/schema/11_notification-log";

export async function dispatchNotification(
    payload: EventPayload,
    policyId?: string,
    channelId?: string,
): Promise<DispatchResult> {

    // // 1. Get policy + channel
    // const policy = await db
    //     .select({
    //         policy: alertPolicies,
    //         channel: notificationChannels,
    //     })
    //     .from(alertPolicies)
    //     .innerJoin(
    //         notificationChannels,
    //         eq(alertPolicies.notificationChannelId, notificationChannels.id)
    //     )
    //     .where(eq(alertPolicies.id, policyId))
    //     .then((rows) => rows[0]);
    //
    // if (!policy) {
    //     return {
    //         success: false,
    //         channelId: '',
    //         provider: 'unknown' as any,
    //         error: 'Policy or channel not found',
    //     };
    // }
    //
    // if (!policy.policy.enabled || !policy.channel.enabled) {
    //     return {
    //         success: false,
    //         channelId: policy.channel.id,
    //         provider: policy.channel.provider as any,
    //         error: 'Policy or channel is disabled',
    //     };
    // }

    if (channelId) {
        const channel = await db.query.notificationChannel.findFirst({
            where: eq(drizzleDb.schemas.notificationChannel.id, channelId),
        })

        if (channel) {
            const config = channel.config;

            const result = await dispatchViaProvider(
                channel.provider as any,
                config,
                {...payload, timestamp: payload.timestamp || new Date()},
                channel.id
            );


            const [log] = await db
                .insert(notificationLog)
                .values({
                    channelId: channel.id,
                    // policyId: policy.id,
                    // organizationId: organizationId || null,
                    title: payload.title,
                    message: payload.message,
                    level: payload.level,
                    payload: payload.data || null,
                    success: result.success,
                    error: result.success ? null : result.error,
                    providerResponse: result.response || null,
                })
                .returning({id: notificationLog.id});


            return {
                ...result,
                channelId: channel.id,
            };
        }
    }


    return {
        success: false,
        channelId,
        provider: "smtp",
        error: 'Unknown error',
    };


}