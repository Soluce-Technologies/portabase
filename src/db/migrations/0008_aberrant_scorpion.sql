CREATE TYPE "public"."event_kind" AS ENUM('error_backup', 'error_restore', 'success_restore', 'success_backup', 'weekly_report');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('critical', 'warning', 'info');--> statement-breakpoint
CREATE TABLE "alert_policy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_channel_id" uuid NOT NULL,
	"event_kind" "event_kind"[] NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"database_id" uuid NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notification_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel_id" uuid NOT NULL,
	"policy_id" uuid,
	"organization_id" uuid,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"level" "level" NOT NULL,
	"payload" jsonb,
	"success" boolean NOT NULL,
	"error" text,
	"provider_response" jsonb,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "alert_policy" ADD CONSTRAINT "alert_policy_notification_channel_id_notification_channel_id_fk" FOREIGN KEY ("notification_channel_id") REFERENCES "public"."notification_channel"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_policy" ADD CONSTRAINT "alert_policy_database_id_databases_id_fk" FOREIGN KEY ("database_id") REFERENCES "public"."databases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_channel_id_notification_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."notification_channel"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_policy_id_alert_policy_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."alert_policy"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;