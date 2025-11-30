import {DatabaseWith} from "@/db/schema/07_database";
import {EventPayload} from "@/features/notifications/types";
import {dispatchNotification} from "@/features/notifications/dispatch";


type EventKind = ("error_backup" | "error_restore" | "success_restore" | "success_backup" | "weekly_report")

export async function sendNotificationsBackupRestore(database: DatabaseWith, event: EventKind) {

    if (database.alertPolicies && database.alertPolicies.length > 0) {
        for (const alertPolicy of database.alertPolicies) {
            if (alertPolicy.enabled) {

                const eventKinds = alertPolicy.eventKinds

                if (eventKinds.includes(event)) {

                    const date = new Date()

                    let level: "info" | "critical" = "info";
                    let message = "";
                    let error: string | null = null;

                    switch (event) {
                        case "error_backup":
                        case "error_restore":
                            level = "critical";
                            message = `An error occurred during ${event.includes("backup") ? "backup" : "restore"} on ${date.toISOString()}.`;
                            error = "Check database connection or agent";
                            break;
                        case "success_backup":
                        case "success_restore":
                            level = "info";
                            message = `${event.includes("backup") ? "Backup" : "Restore"} completed successfully at ${date.toISOString()}.`;
                            break;
                        case "weekly_report":
                            level = "info";
                            message = `Weekly report generated at ${date.toISOString()}.`;
                            break;
                    }

                    const titleMap: Record<EventKind, string> = {
                        error_backup: `Backup Notification`,
                        error_restore: `Restore Notification`,
                        success_backup: `Backup Notification`,
                        success_restore: `Restore Notification`,
                        weekly_report: `Weekly Report Notification`,
                    };


                    const payload: EventPayload = {
                        title: titleMap[event],
                        message,
                        level: level,
                        data: {
                            host: database.name,
                            id: database.id,
                            agentDatabaseId: database.agentDatabaseId,
                            error,
                        },
                    };
                    return await dispatchNotification(payload, alertPolicy.id, undefined, undefined);
                }
            }
        }
    }

}