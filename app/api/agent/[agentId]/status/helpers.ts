import {Agent, Database} from "@prisma/client";
import {prisma} from "@/prisma";
import {NextResponse} from "next/server";
import {Body} from "./route";
import {isUuidv4} from "@/utils/verify-uuid";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";








export async function handleDatabases(body: Body, agent: Agent, lastContact: Date) {
    const databasesResponse = [];

    const formatDatabase = (database: Database, backupAction: boolean, restoreAction: boolean, UrlBackup: string) => ({
        generatedId: database.generatedId,
        dbms: database.dbms,
        data: {
            backup: {
                action: backupAction,
                cron: "",
            },
            restore: {
                action: restoreAction,
                file: UrlBackup,
            },
        },
    });

    for (const db of body.databases) {
        const existingDatabase = await prisma.database.findFirst({
            where: {
                generatedId: db.generatedId,
            },
        });

        let backupAction: boolean = false
        let restoreAction: boolean = false
        let UrlBackup: string = null

        if (!existingDatabase) {
            if (!isUuidv4(db.generatedId)) {
                return NextResponse.json(
                    { error: "generatedId is not a valid uuid" },
                    { status: 500 }
                );
            }
            const databaseCreated = await prisma.database.create({
                data: {
                    agentId: agent.id,
                    name: db.name,
                    dbms: db.dbms,
                    generatedId: db.generatedId,
                    lastContact: lastContact,
                },
            });

            if (databaseCreated) {
                databasesResponse.push(formatDatabase(databaseCreated, backupAction,restoreAction , UrlBackup));
            }
        } else {
            const databaseUpdated = await prisma.database.update({
                where: {
                    id: existingDatabase.id,
                },
                data: {
                    lastContact: lastContact,
                },
            });

            const backup = await prisma.backup.findFirst({
                where: {
                    databaseId: databaseUpdated.id,
                    status: "waiting"
                }
            })

            const restoration = await prisma.restauration.findFirst({
                where:{
                    databaseId: databaseUpdated.id,
                    status: "waiting"
                }
            })


            if(backup){
                backupAction = true
                await prisma.backup.update({
                    where:{
                        id: backup.id
                    },
                    data: {
                        status: "ongoing"
                    }
                })
            }

            if(restoration){
                restoreAction = true

                const backupToRestore = await prisma.backup.findFirst({
                    where:{
                        id: restoration.backupId
                    }
                })
                const fileName = backupToRestore.file
                UrlBackup = await getFileUrlPresignedLocal(fileName)
                await prisma.restauration.update({
                    where: {
                        id: restoration.id
                    },
                    data:{
                        status: "ongoing"
                    }
                })
            }


            databasesResponse.push(formatDatabase(databaseUpdated, backupAction, restoreAction, UrlBackup));
        }
    }
    return databasesResponse;
}