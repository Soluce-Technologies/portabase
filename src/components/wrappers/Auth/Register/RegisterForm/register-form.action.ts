"use server"
import {RegisterSchema} from "@/components/wrappers/Auth/Register/RegisterForm/register-form.schema";
import {action} from "@/safe-actions";
import {prisma} from "@/prisma";
import {hashPassword} from "@/utils/password";


export const registerUserAction = action
    .schema(RegisterSchema)
    .action(async ({parsedInput, ctx}) => {
        const user = await prisma.user.findUnique({ where: { email: parsedInput.email } });
        console.log(user);
        if (!user && parsedInput.password === parsedInput.confirmPassword) {
            const new_user = await prisma.user.create({
                data: {
                    name: parsedInput.name,
                    email: parsedInput.email,
                    password: await hashPassword(parsedInput.password),
                },
            });
            return {
                data: new_user,
            }
        }
        return {
            data: user,
        }
    });