import {prisma} from "@/prisma";
import {NextRequest, NextResponse} from "next/server";
import {Agent, Database, Dbms} from "@prisma/client";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {tree} from "next/dist/build/templates/app-page";

// Regular expression for UUIDv4
const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Type guard to check if a string is a valid UUIDv4
function isUuidv4(value: string): value is string {
    console.log(value)
    console.log(uuidv4Regex.test(value))
    return uuidv4Regex.test(value);
}


export type databaseAgent = {
    name: string,
    dbms: Dbms,
    generatedId: string
}

export type Body = {
    databases: databaseAgent[]
}


export async function GET(request: Request) {
    const url = await getFileUrlPresignedLocal("d4a7fa35-2506-4d01-a612-a8ef2e2cc1c5.dump")
    return Response.json({
        message: url
    })
}



export async function POST(
    request: Request,
    {params}: { params: Promise<{ agentId: string }> }
) {
    try {

        const agentId = (await params).agentId
        const body: Body = await request.json();
        const lastContact = new Date()

        const agent = await prisma.agent.findFirst({
            where: {
                id: agentId
            }
        })

        if (!agent) {
            return NextResponse.json({error: "Agent not found"}, {status: 404})
        }

        const databasesResponse = await handleDatabases(body, agent, lastContact)


        const response = {
            agent: {
                id: agentId,
                lastContact: lastContact
            },
            databases: databasesResponse
        }


        return Response.json({
            message: response
        })
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}


async function handleDatabases(body: Body, agent: Agent, lastContact: Date) {
    const databasesResponse = [];

    // Helper function to format the database response
    const formatDatabase = (database) => ({
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

            // Create a new database
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
            // Update the existing database
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