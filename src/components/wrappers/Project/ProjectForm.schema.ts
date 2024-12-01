import {z} from "zod";
import Database from "@prisma/client"

export const ProjectSchema = z.object({
    name: z.string(),
    slug: z.string(),
    databases: z.array(z.string()),
});

export type ProjectType = z.infer<typeof ProjectSchema>;
