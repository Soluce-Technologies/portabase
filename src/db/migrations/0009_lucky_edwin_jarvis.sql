ALTER TABLE "alert_policy" DROP CONSTRAINT "alert_policy_notification_channel_id_notification_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "alert_policy" ADD CONSTRAINT "alert_policy_notification_channel_id_notification_channel_id_fk" FOREIGN KEY ("notification_channel_id") REFERENCES "public"."notification_channel"("id") ON DELETE cascade ON UPDATE no action;