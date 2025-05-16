import { z } from "zod";

export const AgentSchema = z.object({
    name: z.string(),
    slug: z
        .string()
        .regex(/^[a-zA-Z0-9_-]*$/)
        .min(5)
        .max(25),
    description: z.string(),
});

export type AgentType = z.infer<typeof AgentSchema>;
