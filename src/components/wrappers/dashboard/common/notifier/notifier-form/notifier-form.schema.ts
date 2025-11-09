import {z} from "zod";


export const NotificationChannelFormSchema = z.object({
    name: z
        .string()
        .min(5, "Name must be at least 5 characters long")
        .max(40, "Name must be at most 40 characters long"),

    provider: z.enum(["curl", "slack", "smtp", "webhook"], {
        required_error: "Provider is required",
    }),

    config: z.record(z.string()).optional(),


    enabled: z.boolean().default(true),

});

export type NotificationChannelFormType = z.infer<typeof NotificationChannelFormSchema>;
