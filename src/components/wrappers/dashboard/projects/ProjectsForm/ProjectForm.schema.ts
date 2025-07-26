import { z } from "zod";

export const ProjectSchema = z.object({
    name: z.string(),
    databases: z.array(z.string()),
});

export type ProjectType = z.infer<typeof ProjectSchema>;
