import {z} from "zod";


export const OrganizationSchema = z.object({
    name: z.string(),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;
