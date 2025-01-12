"use server"

import {userAction} from "@/safe-actions";
import {z} from "zod";
import {v4 as uuidv4} from 'uuid';
import {mkdir, writeFile} from "fs/promises";
import path from "path";
import {env} from "@/env.mjs";
import {checkMinioAlive, createPublicBucket, saveFileInBucket} from "@/utils/s3-file-management";
import {prisma} from "@/prisma";
import {UploadedObjectInfo} from "minio/src/internal/type";
import {Settings} from "@prisma/client";
import {getServerUrl} from "@/utils/get-server-url";


export const uploadImageAction = userAction
    .schema(z.instanceof(FormData))
    .action(async ({parsedInput: formData, ctx}) => {

        const file = formData.get("file") as File
        const uuid = uuidv4()
        const fileFormat = file.name.split(".").slice(-1)[0]
        const fileName = uuid + "." + fileFormat
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const settings = await prisma.settings.findUnique({
            where:{
                name: "system"
            }
        })

        let result: void | UploadedObjectInfo;
        const bucketName = 'public-image-bucket';

        if(settings.storage === "local") {
            result = await uploadLocal(fileName,buffer)
        }else if (settings.storage === "s3"){
            result = await uploadS3Compatible(bucketName,fileName, buffer)
        }

        const url = getUrl(fileName, settings, bucketName)
        console.log(url)
        return {
            data: {result: result, url: url},
        }


    });


function getUrl(fileName:string, settings: Settings, bucketName: string):string {
    if (env.NODE_ENV === "production") {
        if(settings.storage === "s3"){
            return `https://${env.S3_ENDPOINT}/${bucketName}/${fileName}`
        }else if(settings.storage === "local"){
            const url = getServerUrl()
            return `${url}/api/images/${fileName}`
        }

    } else {
        if(settings.storage === "s3"){
            return `http://localhost:${env.S3_PORT}/${bucketName}/${fileName}`
        }else if(settings.storage === "local"){
            const url = getServerUrl()
            return `${url}/api/images/${fileName}`
        }
    }
}

async function uploadLocal(fileName: string, buffer: any) {
    const localDir = "private/uploads/images/"
    try {
        await mkdir(path.join(process.cwd(), localDir), { recursive: true });
        return await writeFile(
            path.join(process.cwd(), localDir + fileName),
            buffer
        )

    } catch (error) {
        console.log("Error occured ", error);
        throw new Error('An error occured while importing image');

    }
}

async function uploadS3Compatible(bucketName: string, fileName: string, buffer: any){
    await createPublicBucket({bucketName});
    return await saveFileInBucket({
        bucketName,
        fileName,
        file: buffer,
    })
}

export async function checkConnexionToS3(){
    return await checkMinioAlive()

}