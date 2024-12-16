"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";
import {
    S3FormSchema,
    StorageSwitchSchema
} from "@/components/wrappers/dashboard/admin/AdminStorageTab/StorageS3Form/s3-form.schema";


export const updateS3SettingsAction = userAction
    .schema(
        z.object({
                name: z.string(),
                data: S3FormSchema,
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
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

export const updateStorageSettingsAction = userAction
    .schema(
        z.object({
                name: z.string(),
                data: StorageSwitchSchema,
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
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


