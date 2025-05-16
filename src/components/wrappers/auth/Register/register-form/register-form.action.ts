"use server";
import { RegisterSchema } from "@/components/wrappers/auth/Register/register-form/register-form.schema";
import { action } from "@/safe-actions";
import { signUp } from "@/lib/auth/auth-client";
import { db } from "@/db";
import { user as drizzleUser } from "@/db/schema/01_user";
import { eq } from "drizzle-orm";

export const registerUserAction = action.schema(RegisterSchema).action(async ({ parsedInput }: { parsedInput: typeof RegisterSchema._type }) => {
    const [user] = await db.select().from(drizzleUser).where(eq(drizzleUser.email, parsedInput.email)).limit(1);

    if (!user && parsedInput.password === parsedInput.confirmPassword) {
        const { data, error } = await signUp.email({
            email: parsedInput.email,
            password: parsedInput.password,
            name: parsedInput.name,
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            data: data?.user,
        };
    }
    throw new Error("An error occured while creating user");
});
