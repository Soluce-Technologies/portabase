import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({message: "Email is invalid"}),
    password: z.string().nonempty({message: "Password could not be empty"}),

})

export type LoginType = z.infer<typeof LoginSchema>;
