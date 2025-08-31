ALTER TABLE "settings" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "backups" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "databases" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "restorations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "retention_policies" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "deleted_at" timestamp;