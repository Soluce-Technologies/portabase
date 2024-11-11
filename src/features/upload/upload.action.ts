"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {v4 as uuidv4} from 'uuid';
import { writeFile } from "fs/promises";
import path from "path";
import {env} from "@/env.mjs";


export const uploadImageAction = userAction
    .schema(z.instanceof(FormData))
    .action(async ({parsedInput: formData, ctx}) => {

        const file = formData.get("file") as File
        const uuid = uuidv4()

        const fileFormat = file.name.split(".").slice(-1)[0]
        const fileName = uuid + "." + fileFormat
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const localDir = "public/uploads/"

        try {
            const result = await writeFile(
                path.join(process.cwd(), localDir + fileName),
                buffer
            );

            let url: string = "";

            if (env.NODE_ENV === "production") {
                // url = `https://${env.S3_ENDPOINT}/${bucketName}/${fileName}`
            } else {
                url = `http://localhost:8887/uploads/${fileName}`
            }
            return {
                data: {result: result, url: url},
            }

        } catch (error) {
            console.log("Error occured ", error);
            throw new Error('An error occured while importing image');

        }


    });


