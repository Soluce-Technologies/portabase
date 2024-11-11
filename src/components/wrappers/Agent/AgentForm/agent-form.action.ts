"use server"
import {ActionError, userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {AgentSchema} from "@/components/wrappers/Agent/AgentForm/action-form.schema";
import {z} from "zod";


const verifySlugUniqueness = async (slug: string, agentId?: string) => {
    const slugExists = await prisma.agent.count({
        where: {
            slug: slug,
            id: agentId ? {
                not: agentId
            } : undefined,
        },
    })

    console.log(slugExists)
    if (slugExists) {
        throw new ActionError("Slug already exists");
    }
}


export const createAgentAction = userAction
    .schema(AgentSchema)
    .action(async ({parsedInput, ctx}) => {
        // Verify if slug already exist
        await verifySlugUniqueness(parsedInput.slug);
        const agent = await prisma.agent.create({
            data: {
                ...parsedInput
            }
        })

        // await sendEmailIfUserCreatedFirstForm(ctx.user)

        return {
            data: agent,
        }
    });


export const updateAgentAction = userAction
    .schema(
        z.object({
                id: z.string(),
                data: AgentSchema,
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
        await verifySlugUniqueness(parsedInput.data.slug, parsedInput.id);

        console.log("parsedInput", parsedInput.data)

        const updatedAgent = await prisma.agent.update({
            where: {
                id: parsedInput.id,
            },
            data: parsedInput.data,
        })

        return {
            data: updatedAgent,

        }
    })
