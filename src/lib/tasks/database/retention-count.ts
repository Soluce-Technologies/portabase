import * as drizzleDb from "@/db";
import {db} from "@/db";
import {desc, eq} from "drizzle-orm";

export async function enforceRetentionCount(databaseId: string, count: number) {
    const backups = await db.query.backup.findMany({
        where: eq(drizzleDb.schemas.backup.databaseId, databaseId),
        orderBy: desc(drizzleDb.schemas.backup.createdAt),
    });

    const toDelete = backups.slice(count); // keep first `count`, delete rest

    for (const b of toDelete) {
        await db.delete(drizzleDb.schemas.backup).where(eq(drizzleDb.schemas.backup.id, b.id));
        // TODO: delete backup file from storage
    }
}