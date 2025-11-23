import {pgTable, uuid, timestamp, jsonb, varchar, boolean, text, pgEnum} from 'drizzle-orm/pg-core';
import {notificationChannel, providerKindEnum} from "@/db/schema/09_notification-channel";
import {alertPolicy} from "@/db/schema/10_alert-policy";
import {organization} from "@/db/schema/03_organization";
import {timestamps} from "@/db/schema/00_common";

export const levelEnum = pgEnum('level', ['critical', 'warning', 'info']);


export const notificationLog = pgTable('notification_log', {
    id: uuid('id').defaultRandom().primaryKey(),

    channelId: uuid('channel_id')
        .notNull()
        .references(() => notificationChannel.id, { onDelete: 'restrict' }),
    policyId: uuid('policy_id')
        .references(() => alertPolicy.id, { onDelete: 'restrict' }),
    organizationId: uuid('organization_id')
        .references(() => organization.id, { onDelete: 'set null' }),

    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    level: levelEnum('level').notNull(),
    payload: jsonb('payload'),

    success: boolean('success').notNull(),
    error: text('error'),
    providerResponse: jsonb('provider_response'),
    sentAt: timestamp('sent_at').defaultNow().notNull(),

    ...timestamps
});