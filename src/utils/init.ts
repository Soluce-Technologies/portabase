import {prisma} from "@/prisma";
import {Settings} from "@prisma/client";
import {env} from "@/env.mjs";


export function init() {
    consoleAscii()
    console.log("====Init Functions====")
    createSettingsIfNotExist()
        .then(() => {
            console.log('====Initialization completed====');
        })
        .catch((err) => {
            console.error('Error during initialization:', err);
        });
}

async function createSettingsIfNotExist() {

    const configSettings = {
        name: "system",
        smtpPassword: env.SMTP_PASSWORD ?? null,
        smtpFrom: env.SMTP_FROM ?? null,
        smtpHost: env.SMTP_HOST ?? null,
        smtpPort: env.SMTP_PORT ?? null,
        smtpUser: env.SMTP_USER ?? null,
        s3EndPointUrl: env.S3_ENDPOINT ?? null,
        s3AccessKeyId: env.S3_ACCESS_KEY ?? null,
        s3SecretAccessKey: env.S3_SECRET_KEY ?? null,
        S3BucketName: env.S3_BUCKET_NAME ?? null,
    }



    const settings = await prisma.settings.findUnique({
        where: {
            name: "system",
        }
    })
    if(!settings){
        console.log("====Init Setting : Create ====")
        await prisma.settings.create({
            data: {
                ...configSettings
            }
        })
    }else{
        console.log("====Init Setting : Update ====")
        await prisma.settings.update({
            where: {
                name: "system",
            },
            data: {
                ...configSettings,
            }
        })
    }

}

function consoleAscii(){
    console.log("\n" +
        "    ____                __          __                          _____                               \n" +
        "   / __ \\ ____   _____ / /_ ____ _ / /_   ____ _ _____ ___     / ___/ ___   _____ _   __ ___   _____\n" +
        "  / /_/ // __ \\ / ___// __// __  // __ \\ / __  // ___// _ \\    \\__ \\ / _ \\ / ___/| | / // _ \\ / ___/\n" +
        " / ____// /_/ // /   / /_ / /_/ // /_/ // /_/ /(__  )/  __/   ___/ //  __// /    | |/ //  __// /    \n" +
        "/_/     \\____//_/    \\__/ \\__,_//_.___/ \\__,_//____/ \\___/   /____/ \\___//_/     |___/ \\___//_/     \n" +
        "                                                                                                    \n")
}