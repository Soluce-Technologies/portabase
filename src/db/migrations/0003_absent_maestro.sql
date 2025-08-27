CREATE TYPE "public"."retention_policy_type" AS ENUM('count', 'days', 'gfs');--> statement-breakpoint
CREATE TABLE "retention_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"database_id" uuid NOT NULL,
	"type" "retention_policy_type" NOT NULL,
	"count" integer DEFAULT 7,
	"days" integer DEFAULT 30,
	"gfs_daily" integer DEFAULT 7,
	"gfs_weekly" integer DEFAULT 4,
	"gfs_monthly" integer DEFAULT 12,
	"gfs_yearly" integer DEFAULT 3,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "retention_policies" ADD CONSTRAINT "retention_policies_database_id_databases_id_fk" FOREIGN KEY ("database_id") REFERENCES "public"."databases"("id") ON DELETE cascade ON UPDATE no action;