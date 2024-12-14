import {NextResponse} from "next/server";
import {isUuidv4} from "@/utils/verify-uuid";
import {prisma} from "@/prisma";



export type BodyResultRestore = {
    generatedId: string
    status: string
}


export async function POST(
    request: Request,
    {params}: { params: Promise<{ agentId: string }> }
) {

    try {
        const agentId = (await params).agentId
        const body: BodyResultRestore = await request.json();

        console.log(body)
        console.log(agentId)


        if (!isUuidv4(body.generatedId)) {
            return NextResponse.json(
                {error: "generatedId is not a valid uuid"},
                {status: 500}
            );
        }

        const agent = await prisma.agent.findFirst({
            where: {
                id: agentId
            }
        })
        if (!agent) {
            return NextResponse.json({error: "Agent not found"}, {status: 404})
        }

        const database = await prisma.database.findFirst({
            where: {
                generatedId: body.generatedId
            }
        })

        if (!database) {
            return NextResponse.json({error: "Database associated with generatedId provided not found"}, {status: 404})
        }

        const restoration = await prisma.restoration.findFirst({
            where: {
                status : "ongoing",
                databaseId: database.id
            }
        })
        if (!restoration) {
            return NextResponse.json({error: "Unable to fin the corresponding restoration"}, {status: 404})
        }

        await prisma.restoration.update({
            where:{
                id : restoration.id
            },
            data: {
                status: body.status
            }
        })

        const response = {
            message: true,
            details: "Restoration successfully updated"
        }
        return Response.json(response , {status: 200})


    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}