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

            const users = await prisma.user.findMany({
                where:{
                    deleted: { not: true },
                }
            })
            const role = users.length > 0 ? "pending" : "admin"

            const new_user = await prisma.user.create({
                data: {
                    name: parsedInput.name,
                    email: parsedInput.email,
                    password: await hashPassword(parsedInput.password),
                    role: role
                },
            });
            return {
                data: new_user,
            }
        }
        throw new Error('An error occured while creating user');

    });