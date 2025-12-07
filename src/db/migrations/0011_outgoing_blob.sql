ALTER TABLE "notification_log" DROP CONSTRAINT "notification_log_channel_id_notification_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_log" DROP CONSTRAINT "notification_log_policy_id_alert_policy_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_log" DROP CONSTRAINT "notification_log_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_log" ADD COLUMN "event" text;--> statement-breakpoint
ALTER TABLE "notification_log" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_log" ADD COLUMN "provider_name" text NOT NULL;