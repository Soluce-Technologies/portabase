ALTER TABLE "notification_channel" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."provider_kind";--> statement-breakpoint
CREATE TYPE "public"."provider_kind" AS ENUM('slack', 'smtp');--> statement-breakpoint
ALTER TABLE "notification_channel" ALTER COLUMN "provider" SET DATA TYPE "public"."provider_kind" USING "provider"::"public"."provider_kind";