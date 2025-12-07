import {pgTable, uuid, timestamp, jsonb, varchar, boolean, text, pgEnum} from 'drizzle-orm/pg-core';
import {notificationChannel} from "@/db/schema/09_notification-channel";
import {alertPolicy} from "@/db/schema/10_alert-policy";
import {timestamps} from "@/db/schema/00_common";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import {relations} from "drizzle-orm";


export const levelEnum = pgEnum('level', ['critical', 'warning', 'info']);


export const notificationLog = pgTable('notification_log', {
    id: uuid('id').defaultRandom().primaryKey(),

    channelId: uuid('channel_id').notNull(),
    policyId: uuid('policy_id'),
    organizationId: uuid('organization_id'),

    event: text("event"),
    provider: text("provider").notNull(),
    providerName: text("provider_name").notNull(),

    title: varchar('title', {length: 255}).notNull(),
    message: text('message').notNull(),
    level: levelEnum('level').notNull(),
    payload: jsonb('payload'),


    success: boolean('success').notNull(),
    error: text('error'),
    providerResponse: jsonb('provider_response'),
    sentAt: timestamp('sent_at').defaultNow().notNull(),

    ...timestamps
});


export const notificationChannelsToAlertPoliciesRelations = relations(notificationChannel, ({many}) => ({
    alertPolicies: many(alertPolicy),
}));

export const notificationLogSchema = createSelectSchema(notificationLog);
export type NotificationLog = z.infer<typeof notificationLogSchema>;

export type NotificationLevel = (typeof levelEnum.enumValues)[number];
