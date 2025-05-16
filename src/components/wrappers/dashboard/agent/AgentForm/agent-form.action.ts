"use server";
import { ActionError, userAction } from "@/safe-actions";
import { AgentSchema } from "@/components/wrappers/dashboard/agent/AgentForm/agent-form.schema";
import { z } from "zod";
import { eq, and, ne, count } from "drizzle-orm";
import { db } from "@/db";
import { agent } from "@/db/schema";

const verifySlugUniqueness = async (slug: string, agentId?: string) => {
    const conditions = agentId ? and(eq(agent.slug, slug), ne(agent.id, agentId)) : eq(agent.slug, slug);

    const [countResult] = await db.select({ count: count() }).from(agent).where(conditions);

    if (countResult.count > 0) {
        throw new ActionError("Slug already exists");
    }
};

export const createAgentAction = userAction.schema(AgentSchema).action(async ({ parsedInput }) => {
    await verifySlugUniqueness(parsedInput.slug);

    const [createdAgent] = await db.insert(agent).values(parsedInput).returning();

    return {
        data: createdAgent,
    };
});

export const updateAgentAction = userAction
    .schema(
        z.object({
            id: z.string(),
            data: AgentSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        await verifySlugUniqueness(parsedInput.data.slug, parsedInput.id);

        const [updatedAgent] = await db.update(agent).set(parsedInput.data).where(eq(agent.id, parsedInput.id)).returning();

        return {
            data: updatedAgent,
        };
    });
