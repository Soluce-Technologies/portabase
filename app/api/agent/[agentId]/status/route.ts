import {prisma} from "@/prisma";
import {NextResponse} from "next/server";

export async function POST(
    request: Request,
    {params}: { params: Promise<{ agentId: string }> }
) {
    const agentId = (await params).agentId

    const agent = await prisma.agent.findFirst({
        where: {
            id: agentId
        }
    })

    if(!agent){
        return NextResponse.json({error: "Agent not found"}, {status: 404})
    }

    await prisma.agent.update({
        where: {
            id: agent.id,
        },
        data: {
            lastContact: new Date(),
        }
    });

    const response = {
        agent: {
            id: agentId,
            lastContact: agent.lastContact
        },
        backup: {
            action: false,
            cron : ""
        },
        restore: {
            action: false,
            file: ""
        }
    }

    return Response.json({
        message: response
    })
}