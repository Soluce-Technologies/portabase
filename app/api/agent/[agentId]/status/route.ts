import {NextResponse} from "next/server";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {handleDatabases} from "./helpers";
import {eventEmitter} from "../../../events/route";
import * as drizzleDb from "@/db";
import {db} from "@/db";
import {EDbmsSchema} from "@/db/schema/types";
import {eq} from "drizzle-orm";

export type databaseAgent = {
    name: string,
    dbms: EDbmsSchema,
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
        const lastContact = new Date();


        const agent = await db.query.agent.findFirst({
            where: eq(drizzleDb.schemas.agent.id, agentId),
        })

        if (!agent) {
            return NextResponse.json({error: "Agent not found"}, {status: 404})
        }
        const databasesResponse = await handleDatabases(body, agent, lastContact)


        await db
            .update(drizzleDb.schemas.agent)
            .set({ lastContact: lastContact })
            .where(eq(drizzleDb.schemas.agent.id, agentId));

        eventEmitter.emit('modification', {update: true});

        const response = {
            agent: {
                id: agentId,
                lastContact: lastContact
            },
            databases: databasesResponse
        }
        console.log(response)
        return Response.json(response)
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

