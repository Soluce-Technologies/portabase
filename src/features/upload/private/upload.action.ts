"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import * as fs from "node:fs";
import { getServerUrl } from "@/utils/get-server-url";

const privateLocalDir = "private/uploads/files/";

export async function uploadLocalPrivate(fileName: string, buffer: any) {
    try {
        await mkdir(path.join(process.cwd(), privateLocalDir), { recursive: true });

        await writeFile(path.join(process.cwd(), privateLocalDir, fileName), buffer);

        return {
            success: true,
            message: "File uploaded successfully",
            filePath: path.join(privateLocalDir, fileName),
        };
    } catch (error) {
        console.error("Error occurred:", error);
        throw new Error("An error occurred while importing the private file");
    }
}

export async function getFileUrlPresignedLocal(fileName: string) {
    try {
        const filePath = path.join(privateLocalDir, fileName);
        await mkdir(path.join(process.cwd(), privateLocalDir), { recursive: true });

        if (!fs.existsSync(filePath)) {
            console.error("File not found at:", filePath);
            return `File not found at: ${filePath}`;
        }
        const crypto = require("crypto");
        const baseUrl = getServerUrl();

        const expiresAt = Date.now() + 60 * 1000; // expires in 1 minute
        const token = crypto.createHash("sha256").update(`${fileName}${expiresAt}`).digest("hex");
        return `${baseUrl}/api/files/${fileName}?token=${token}&expires=${expiresAt}`;
    } catch (error) {
        throw error;
    }
}
