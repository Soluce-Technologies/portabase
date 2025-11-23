import {desc, eq, and, gte, lte} from 'drizzle-orm';
import {
    notificationLog
} from "@/db/schema/11_notification-log";
import {
    notificationChannel,
} from "@/db/schema/09_notification-channel";
import {db} from "@/db";
import {alertPolicy} from "@/db/schema/10_alert-policy";


export async function getNotificationHistory(filters?: {
    channelId?: string;
    policyId?: string;
    organizationId?: string;
    level?: string;
    success?: boolean;
    from?: Date;
    to?: Date;
    limit?: number;
}) {
    const where = [];
    if (filters?.channelId) where.push(eq(notificationLog.channelId, filters.channelId));
    if (filters?.policyId) where.push(eq(notificationLog.policyId, filters.policyId));
    if (filters?.organizationId) where.push(eq(notificationLog.organizationId, filters.organizationId));
    if (filters?.level) where.push(eq(notificationLog.level, filters.level));
    if (typeof filters?.success === 'boolean') where.push(eq(notificationLog.success, filters.success));
    if (filters?.from) where.push(gte(notificationLog.sentAt, filters.from));
    if (filters?.to) where.push(lte(notificationLog.sentAt, filters.to));

    return await db
        .select({
            id: notificationLog.id,
            title: notificationLog.title,
            level: notificationLog.level,
            success: notificationLog.success,
            error: notificationLog.error,
            sentAt: notificationLog.sentAt,
            channel: {
                id: notificationLog.id,
                name: notificationChannel.name,
                provider: notificationChannel.provider,
            },
            policy: {
                id: alertPolicy.id,
                eventKind: alertPolicy.eventKind,
            },
        })
        .from(notificationLog)
        .leftJoin(notificationChannel, eq(notificationLog.channelId, notificationChannel.id))
        .leftJoin(alertPolicy, eq(notificationLog.policyId, alertPolicy.id))
        .where(and(...where))
        .orderBy(desc(notificationLog.sentAt))
        .limit(filters?.limit || 100);
}