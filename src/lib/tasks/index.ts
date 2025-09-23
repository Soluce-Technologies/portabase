import cron from "node-cron";
import {retentionCleanTask} from "@/lib/tasks/database";
import {env} from "@/env.mjs";


export const retentionJob = cron.schedule(env.RETENTION_CRON, async () => {
    try {
        console.log("Retention Job : Starting task");
        await retentionCleanTask();
    } catch (err) {
        console.error(`[CRON] Error:`, err);
    }
});