import {Agent, Database} from "@prisma/client";
import {prisma} from "@/prisma";
import {NextResponse} from "next/server";
import {Body} from "./route";
import {isUuidv4} from "@/utils/verify-uuid";








export async function handleDatabases(body: Body, agent: Agent, lastContact: Date) {
    const databasesResponse = [];

    const formatDatabase = (database: Database, backupAction: boolean) => ({
        generatedId: database.generatedId,
        dbms: database.dbms,
        data: {
            backup: {
                action: backupAction,
                cron: "",
            },
            restore: {
                action: false,
                file: "",
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
                databasesResponse.push(formatDatabase(databaseCreated, backupAction));
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

            databasesResponse.push(formatDatabase(databaseUpdated, backupAction));
        }
    }
    return databasesResponse;
}