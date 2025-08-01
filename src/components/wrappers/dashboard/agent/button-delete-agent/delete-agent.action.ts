"use server";

import {userAction} from "@/safe-actions";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {ServerActionResult} from "@/types/action-type";
import {eq} from "drizzle-orm";
import {db} from "@/db";
import * as drizzleDb from "@/db";
import {Agent} from "@/db/schema/07_agent";

export const deleteAgentAction = userAction.schema(z.string()).action(async ({parsedInput}): Promise<ServerActionResult<Agent>> => {
    try {

        // const deletedAgent: Agent[] = await db.delete(drizzleDb.schemas.agent).where(eq(drizzleDb.schemas.agent.id, parsedInput)).returning();

        const uuid = uuidv4();

        const updatedAgent = await db
            .update(drizzleDb.schemas.agent)
            .set({
                isArchived: true,
                slug: uuid,
            })
            .where(eq(drizzleDb.schemas.agent.id, parsedInput))
            .returning();


        if (!updatedAgent[0]) {
            throw new Error("Agent not found or update failed");
        }


        return {
            success: true,
            value: updatedAgent[0],
            actionSuccess: {
                message: "Agent has been successfully deleted.",
                messageParams: {projectId: parsedInput},
            },
        };
    } catch (error) {
        return {
            success: false,
            actionError: {
                message: "Failed to delete agent.",
                status: 500,
                cause: error instanceof Error ? error.message : "Unknown error",
                messageParams: {projectId: parsedInput},
            },
        };
    }
});
