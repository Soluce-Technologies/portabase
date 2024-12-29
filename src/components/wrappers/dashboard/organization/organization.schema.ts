import {z} from "zod";


export const OrganizationSchema = z.object({
    name: z.string().min(5).max(40),
    slug: z.string().regex(/^[a-zA-Z0-9_-]*$/).min(5).max(20),

});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;
