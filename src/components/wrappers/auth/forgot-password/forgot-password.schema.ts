import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;