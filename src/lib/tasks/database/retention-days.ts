import {db} from "@/db";
import {eq, lt} from "drizzle-orm";
import * as drizzleDb from "@/db";

export async function enforceRetentionDays(databaseId: string, days: number) {
    const cutoff = new Date(Date.now() - days * 86400000); // days → ms

    await db.delete(drizzleDb.schemas.backup).where(
        eq(drizzleDb.schemas.backup.databaseId, databaseId) &&
        lt(drizzleDb.schemas.backup.createdAt, cutoff)
    );

    // Note: files should also be deleted from storage
}