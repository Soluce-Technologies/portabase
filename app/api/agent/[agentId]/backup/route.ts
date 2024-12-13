import {NextResponse} from "next/server";
import {Body} from "../status/route";
import {prisma} from "@/prisma";
import {isUuidv4} from "@/utils/verify-uuid";
import {uploadLocalPrivate} from "@/features/upload/private/upload.action";
import {v4 as uuidv4} from "uuid";
import {Backup, Database} from "@prisma/client";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ agentId: string }> }
) {
    try {
        const contentType = request.headers.get("Content-Type");

        if (!contentType || !contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { error: "Unsupported or missing Content-Type" },
                { status: 400 }
            );
        }

        const agentId = (await params).agentId;
        const formData = await request.formData();
        const generatedId = formData.get("generatedId") as string | null;
        const method = formData.get("method") as string | null;

        if (!generatedId || !isUuidv4(generatedId)) {
            return NextResponse.json(
                { error: "generatedId is not a valid UUID" },
                { status: 400 }
            );
        }

        const agent = await prisma.agent.findFirst({
            where: { id: agentId },
        });

        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        const database = await prisma.database.findFirst({
            where: { generatedId },
        });

        if (!database) {
            return NextResponse.json(
                { error: "Database associated with generatedId not found" },
                { status: 404 }
            );
        }

        let backup: Backup | null = null;

        if (method === "automatic") {
            backup = await prisma.backup.create({
                data: {
                    status: "ongoing",
                    databaseId: database.id,
                },
            });

            if (!backup) {
                return NextResponse.json(
                    { error: "Unable to create an automatic backup" },
                    { status: 500 }
                );
            }
        } else {
            backup = await prisma.backup.findFirst({
                where: {
                    status: "ongoing",
                    databaseId: database.id,
                },
            });

            if (!backup) {
                return NextResponse.json(
                    { error: "Unable to find the corresponding backup" },
                    { status: 404 }
                );
            }
        }

        const status = formData.get("status") as string | null;

        if (status === "success") {
            const file = formData.get("file") as File | null;

            if (!file) {
                return NextResponse.json(
                    { error: "File is required for successful backup" },
                    { status: 400 }
                );
            }

            const uuid = uuidv4();
            const fileName = `${uuid}.dump`;
            const buffer = Buffer.from(await file.arrayBuffer());

            const { success, message, filePath } = await uploadLocalPrivate(fileName, buffer);

            if (!success) {
                return NextResponse.json(
                    { error: message },
                    { status: 500 }
                );
            }

            await prisma.backup.update({
                where: { id: backup.id },
                data: {
                    file: fileName,
                    status: "success",
                },
            });

            return NextResponse.json(
                {
                    message: "Backup successfully uploaded",
                },
                { status: 200 }
            );
        } else {
            await prisma.backup.update({
                where: { id: backup.id },
                data: { status: "failed" },
            });

            return NextResponse.json(
                {
                    message: "Backup successfully updated with status failed",
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}