import cron from "node-cron";
import {retentionCleanTask} from "@/lib/tasks/database";


export const retentionJob = cron.schedule("* * * * *", async () => {
    try {
        console.log("Retention Job : Starting task");
        await retentionCleanTask();
    } catch (err) {
        console.error(`[CRON] Error:`, err);
    }
});