import {NextResponse} from "next/server";
import {Body} from "./route";
import {isUuidv4} from "@/utils/verify-uuid";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {Agent} from "@/db/schema/07_agent";
import {Database} from "@/db/schema/06_database";
import * as drizzleDb from "@/db";
import {db as dbClient} from "@/db";
import {and, eq} from "drizzle-orm";

export async function handleDatabases(body: Body, agent: Agent, lastContact: Date) {
    const databasesResponse = [];

    const formatDatabase = (database: Database, backupAction: boolean, restoreAction: boolean, UrlBackup: string) => ({
        generatedId: database.agentDatabaseId,
        dbms: database.dbms,
        data: {
            backup: {
                action: backupAction,
                cron: database.backupPolicy,
            },
            restore: {
                action: restoreAction,
                file: UrlBackup,
            },
        },
    });

    for (const db of body.databases) {

        const existingDatabase = await dbClient.query.database.findFirst({
            where: eq(drizzleDb.schemas.database.agentDatabaseId, db.generatedId)
        });

        let backupAction: boolean = false
        let restoreAction: boolean = false
        let UrlBackup: string = ""

        if (!existingDatabase) {
            if (!isUuidv4(db.generatedId)) {
                return NextResponse.json(
                    { error: "generatedId is not a valid uuid" },
                    { status: 500 }
                );
            }

            const [databaseCreated] = await dbClient
                .insert(drizzleDb.schemas.database)
                .values({
                    agentId: agent.id,
                    name: db.name,
                    dbms: db.dbms,
                    agentDatabaseId: db.generatedId,
                    lastContact: lastContact,
                })
                .returning();

            if (databaseCreated) {
                databasesResponse.push(formatDatabase(databaseCreated, backupAction,restoreAction, UrlBackup));
            }
        } else {



            const [databaseUpdated] = await dbClient
                .update(drizzleDb.schemas.database)
                .set({ lastContact: lastContact })
                .where(eq(drizzleDb.schemas.database.id, existingDatabase.id))
                .returning();



            const backup = await dbClient.query.backup.findFirst({
                where: and(eq(drizzleDb.schemas.backup.databaseId, databaseUpdated.id), eq(drizzleDb.schemas.backup.status,"waiting"))
            })


            const restoration = await dbClient.query.restoration.findFirst({
                where: and(eq(drizzleDb.schemas.restoration.databaseId, databaseUpdated.id), eq(drizzleDb.schemas.restoration.status,"waiting"))
            })


            if(backup){
                backupAction = true

                await dbClient
                    .update(drizzleDb.schemas.backup)
                    .set({ status: "ongoing" })
                    .where(eq(drizzleDb.schemas.backup.id, backup.id));
            }

            if(restoration){
                restoreAction = true


                const backupToRestore = await dbClient.query.backup.findFirst({
                    where: eq(drizzleDb.schemas.backup.id, restoration.backupId),
                })


                const fileName = backupToRestore?.file
                UrlBackup = await getFileUrlPresignedLocal(fileName ?? "")

                await dbClient
                    .update(drizzleDb.schemas.restoration)
                    .set({ status: "ongoing" })
                    .where(eq(drizzleDb.schemas.restoration.id, restoration.id));

            }


            databasesResponse.push(formatDatabase(databaseUpdated, backupAction, restoreAction, UrlBackup));
        }
    }

    return databasesResponse;
}