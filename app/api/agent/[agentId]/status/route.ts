import {prisma} from "@/prisma";
import {NextRequest, NextResponse} from "next/server";
import {Agent, Database, Dbms} from "@prisma/client";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {handleDatabases} from "./helpers";


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

        return Response.json(response)
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

