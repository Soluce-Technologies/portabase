"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";
import {EmailFormSchema} from "@/components/wrappers/Dashboard/Settings/SettingsEmailTab/EmailForm/email-form.schema";


export const updateEmailSettingsAction = userAction
    .schema(
        z.object({
                name: z.string(),
                data: EmailFormSchema,
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {

        console.log("parsedInput", parsedInput.data)

        const updatedSettings = await prisma.settings.update({
            where: {
                name: parsedInput.name,
            },
            data: parsedInput.data,
        })

        return {
            data: updatedSettings,

        }
    })