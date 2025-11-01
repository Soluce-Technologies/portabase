ALTER TABLE "databases" ALTER COLUMN "dbms" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."dbms_status";--> statement-breakpoint
CREATE TYPE "public"."dbms_status" AS ENUM('postgresql', 'mysql');--> statement-breakpoint
ALTER TABLE "databases" ALTER COLUMN "dbms" SET DATA TYPE "public"."dbms_status" USING "dbms"::"public"."dbms_status";