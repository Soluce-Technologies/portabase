import {z} from "zod";


export const ProjectSchema = z.object({
    name: z.string(),
    slug: z.string(),
});

export type ProjectSchema = z.infer<typeof ProjectSchema>;
