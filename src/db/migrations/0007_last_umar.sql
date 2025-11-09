CREATE TYPE "public"."provider_kind" AS ENUM('curl', 'slack', 'smtp', 'webhook');--> statement-breakpoint
CREATE TABLE "notification_channel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "provider_kind" NOT NULL,
	"name" varchar(255) NOT NULL,
	"config" jsonb NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "organization_notification_channels" (
	"organization_id" uuid NOT NULL,
	"notification_channel_id" uuid NOT NULL,
	CONSTRAINT "organization_notification_channels_organization_id_notification_channel_id_unique" UNIQUE("organization_id","notification_channel_id")
);
--> statement-breakpoint
ALTER TABLE "organization_notification_channels" ADD CONSTRAINT "organization_notification_channels_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_notification_channels" ADD CONSTRAINT "organization_notification_channels_notification_channel_id_notification_channel_id_fk" FOREIGN KEY ("notification_channel_id") REFERENCES "public"."notification_channel"("id") ON DELETE cascade ON UPDATE no action;