import {db} from "@/db";
import {enforceRetentionCount} from "@/lib/tasks/database/retention-count";
import {enforceRetentionDays} from "@/lib/tasks/database/retention-days";
import {enforceRetentionGFS} from "@/lib/tasks/database/retention-gsf";
import {retentionPolicy} from "@/db/schema/07_database";
import {eq, isNull} from "drizzle-orm";
import * as drizzleDb from "@/db";
import {eventEmitter} from "../../../../app/api/events/route";


export const retentionCleanTask = async () => {
    try {
        const databases = await db.query.database.findMany({
            with: {
                retentionPolicy: true,
                backups: {
                    where: isNull(drizzleDb.schemas.backup.deletedAt),

                },
            },
        });
        console.log(databases);

        for (const db of databases) {
            if (!db.retentionPolicy) continue; // no policy = skip
            await enforceRetention(db.id, db.retentionPolicy);
        }
    } catch (e: any) {
        console.error("Retention cleanup failed:", e);
        throw e;
    }
};

export async function enforceRetention(
    databaseId: string,
    policy: typeof retentionPolicy.$inferSelect
) {
    console.log(`EnforceRetention: ${policy}`);

    switch (policy.type) {
        case "count":
            await enforceRetentionCount(databaseId, policy.count ?? 7);
            break;

        case "days":
            await enforceRetentionDays(databaseId, policy.days ?? 30);
            break;

        case "gfs":
            await enforceRetentionGFS(databaseId, {
                daily: policy.gfsDaily ?? 7,
                weekly: policy.gfsWeekly ?? 4,
                monthly: policy.gfsMonthly ?? 12,
                yearly: policy.gfsYearly ?? 3,
            });
            break;
    }
    eventEmitter.emit('modification', {update: true});
}
