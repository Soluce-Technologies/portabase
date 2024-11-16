import {z} from "zod";

export const EmailFormSchema = z.object({
    smtpPassword: z.string(),
    smtpFrom: z.string(),
    smtpHost: z.string(),
    smtpPort: z.string(),
    smtpUser: z.string(),
});

export type EmailFormType = z.infer<typeof EmailFormSchema>;
