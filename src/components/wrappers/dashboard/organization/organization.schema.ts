import { z } from "zod";

export const OrganizationSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters long").max(40, "Name must be at most 40 characters long"),
    slug: z
        .string()
        .regex(/^[a-zA-Z0-9_-]*$/, "Slug can only contain letters, numbers, underscores, and hyphens")
        .min(5, "Slug must be at least 5 characters long")
        .max(20, "Slug must be at most 20 characters long"),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;
