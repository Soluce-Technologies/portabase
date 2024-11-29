import {Agent, Database} from "@prisma/client";
import {prisma} from "@/prisma";
import {NextResponse} from "next/server";
import {Body} from "./route";



// Regular expression for UUIDv4
const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Type guard to check if a string is a valid UUIDv4
function isUuidv4(value: string): value is string {
    console.log(value)
    console.log(uuidv4Regex.test(value))
    return uuidv4Regex.test(value);
}





export async function handleDatabases(body: Body, agent: Agent, lastContact: Date) {
    const databasesResponse = [];

    const formatDatabase = (database: Database) => ({
        generatedId: database.generatedId,
        dbms: database.dbms,
        data: {
            backup: {
                action: true,
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
                databasesResponse.push(formatDatabase(databaseCreated));
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
            databasesResponse.push(formatDatabase(databaseUpdated));
        }
    }
    return databasesResponse;
}