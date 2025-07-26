import { z } from "zod";

export const AgentSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export type AgentType = z.infer<typeof AgentSchema>;
