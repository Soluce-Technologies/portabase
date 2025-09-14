import * as drizzleDb from "@/db";
import {db} from "@/db";
import {desc, eq} from "drizzle-orm";
import {deleteBackupCronAction} from "@/lib/tasks/database/utils/delete";

export async function enforceRetentionCount(databaseId: string, count: number) {
    const backups = await db.query.backup.findMany({
        where: eq(drizzleDb.schemas.backup.databaseId, databaseId),
        orderBy: desc(drizzleDb.schemas.backup.createdAt),
        with:{
            database: {
                with: {
                    project: true
                }
            }
        }
    });

    const toDelete = backups.slice(count); // keep first `count`, delete rest

    for (const b of toDelete) {
        // await db.delete(drizzleDb.schemas.backup).where(eq(drizzleDb.schemas.backup.id, b.id));

        const deletion = await deleteBackupCronAction({
            backupId: b.id,
            databaseId: b.databaseId,
            file: b.file!,
            projectSlug: b.database.project?.slug!
        });

        // @ts-ignore
        if (deletion.data.success) {
            // @ts-ignore
            console.log(deletion.data.actionSuccess.message);
        } else {
            // @ts-ignore
            console.log(deletion.data.actionError.message);
        }



    }
}