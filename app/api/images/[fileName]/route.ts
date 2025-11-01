import {NextResponse} from "next/server";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {checkFileExistsInBucket, getObjectFromClient} from "@/utils/s3-file-management";
import {env} from "@/env.mjs";
import * as stream from "node:stream";
import path from "path";
import {db} from "@/db";
import * as drizzleDb from "@/db";
import {eq} from "drizzle-orm";
import fs from "fs/promises";

function nodeStreamToWebStream(nodeStream: stream.Readable) {
    return new ReadableStream({
        start(controller) {
            nodeStream.on("data", chunk => controller.enqueue(chunk));
            nodeStream.on("end", () => controller.close());
            nodeStream.on("error", err => controller.error(err));
        },
        cancel() {
            nodeStream.destroy();
        },
    });
}

const privateS3ImageDir = "images/";


export async function GET(
    req: Request,
    {params}: { params: Promise<{ fileName: string }> }
) {
    const fileName = (await params).fileName;
    if (!fileName) return NextResponse.json({error: "Missing file parameter"}, {status: 400});

    const session = await auth.api.getSession({headers: await headers()});
    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 403});

    const [settings] = await db
        .select()
        .from(drizzleDb.schemas.setting)
        .where(eq(drizzleDb.schemas.setting.name, "system"))
        .limit(1);

    if (!settings) throw new Error("System settings not found.");

    const storageType = settings.storage; // "local" or "s3"
    const ext = fileName.split(".").pop()?.toLowerCase();
    const contentType =
        ext === "png"
            ? "image/png"
            : ext === "jpg" || ext === "jpeg"
                ? "image/jpeg"
                : ext === "gif"
                    ? "image/gif"
                    : ext === "webp"
                        ? "image/webp"
                        : "application/octet-stream";

    try {
        if (storageType === "local") {
            const filePath = path.join(process.cwd(), "private/uploads/images", fileName);

            try {
                await fs.access(filePath);
                const file = await fs.readFile(filePath);

                return new NextResponse(file, {
                    headers: {
                        "Content-Type": contentType,
                        "Cache-Control": "no-store",
                        "Content-Disposition": `inline; filename="${fileName}"`,
                    },
                });
            } catch {
                // if not found locally, fallback to S3
            }
        }

        const exists = await checkFileExistsInBucket({
            bucketName: env.S3_BUCKET_NAME!,
            fileName: `${privateS3ImageDir}${fileName}`,
        });
        if (!exists) return NextResponse.json({error: "File not found"}, {status: 404});

        const nodeStream = await getObjectFromClient({
            bucketName: env.S3_BUCKET_NAME!,
            fileName: `${privateS3ImageDir}${fileName}`,
        });
        const webStream = nodeStreamToWebStream(nodeStream);

        return new NextResponse(webStream, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-store",
                "Content-Disposition": `inline; filename="${fileName}"`,
            },
        });
    } catch (err) {
        console.error("Error streaming image:", err);
        return NextResponse.json({error: "Error fetching file"}, {status: 500});
    }
}