import {prisma} from "@/prisma";
import {NextResponse} from "next/server";
import {Dbms} from "@prisma/client";

// Regular expression for UUIDv4
const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Type guard to check if a string is a valid UUIDv4
function isUuidv4(value: string): value is string {
    console.log(value)
    console.log(uuidv4Regex.test(value))
    return uuidv4Regex.test(value);
}



export type Body = {
    name: string,
    dbms: Dbms,
    generatedId: string
}


export async function POST(
    request: Request,
    {params}: { params: Promise<{ agentId: string }> }
) {
    try {

        const agentId = (await params).agentId
        const body: Body = await request.json();
        const lastContact = new Date()

        if(!isUuidv4(body.generatedId)) {
            return NextResponse.json(
                { error: 'generatedId is not a valid uuid' },
                { status: 500 }
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
                generatedId: body.name,
            }
        })

        if(!database){
            await prisma.database.create({
                data : {
                    agentId: agent.id,
                    name: body.name,
                    dbms: body.dbms,
                    generatedId: body.generatedId,
                    lastContact: lastContact,
                }
            })
        }else{
            await prisma.database.update({
                where: {
                    id: database.id,
                },
                data: {
                    lastContact: lastContact,
                }
            });
        }



        const response = {
            agent: {
                id: agentId,
                lastContact: lastContact
            },
            database:{
                generatedId: body.generatedId,
                dbms: body.dbms,
            },
            backup: {
                action: true,
                cron: ""
            },
            restore: {
                action: false,
                file: ""
            }
        }

        return Response.json({
            message: response
        })
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }



}