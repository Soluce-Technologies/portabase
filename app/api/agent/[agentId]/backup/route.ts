import {NextResponse} from "next/server";
import {isUuidv4} from "@/utils/verify-uuid";
import {uploadLocalPrivate} from "@/features/upload/private/upload.action";
import {v4 as uuidv4} from "uuid";
import {eventEmitter} from "../../../events/route";
import {db} from "@/db";
import {Backup} from "@/db/schema/06_database";
import {and, eq} from "drizzle-orm";
import * as drizzleDb from "@/db";

export async function POST(
    request: Request,
    {params}: { params: Promise<{ agentId: string }> }
) {
    try {
        const contentType = request.headers.get("Content-Type");

        if (!contentType || !contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                {error: "Unsupported or missing Content-Type"},
                {status: 400}
            );
        }
        eventEmitter.emit('modification', {update: true});

        const agentId = (await params).agentId;
        const formData = await request.formData();
        const generatedId = formData.get("generatedId") as string | null;
        const method = formData.get("method") as string | null;

        if (!generatedId || !isUuidv4(generatedId)) {
            return NextResponse.json(
                {error: "generatedId is not a valid UUID"},
                {status: 400}
            );
        }

        const agent = await db.query.agent.findFirst({
            where: eq(drizzleDb.schemas.agent.id, agentId),
        });

        if (!agent) {
            return NextResponse.json(
                {error: "Agent not found"},
                {status: 404}
            );
        }

        const database = await db.query.database.findFirst({
            where: eq(drizzleDb.schemas.database.agentDatabaseId, generatedId),
        });

        if (!database) {
            return NextResponse.json(
                {error: "Database associated with generatedId not found"},
                {status: 404}
            );
        }

        let backup: Backup | null | undefined = null;

        if (method === "automatic") {
            [backup] = await db
                .insert(drizzleDb.schemas.backup)
                .values({
                    status: 'ongoing',
                    databaseId: database.id,
                })
                .returning();


            if (!backup) {
                return NextResponse.json(
                    {error: "Unable to create an automatic backup"},
                    {status: 500}
                );
            }
        } else {
            backup = await db.query.backup.findFirst({
                where: and(
                    eq(drizzleDb.schemas.backup.status, 'ongoing'),
                    eq(drizzleDb.schemas.backup.databaseId, database.id),
                ),
            });


            if (!backup) {
                return NextResponse.json(
                    {error: "Unable to find the corresponding backup"},
                    {status: 404}
                );
            }
        }

        const status = formData.get("status") as string | null;

        if (status === "success") {
            const file = formData.get("file") as File | null;

            if (!file) {
                return NextResponse.json(
                    {error: "File is required for successful backup"},
                    {status: 400}
                );
            }

            const uuid = uuidv4();
            const fileName = `${uuid}.dump`;
            const buffer = Buffer.from(await file.arrayBuffer());

            const {success, message, filePath} = await uploadLocalPrivate(fileName, buffer);

            if (!success) {
                return NextResponse.json(
                    {error: message},
                    {status: 500}
                );
            }

            await db
                .update(drizzleDb.schemas.backup)
                .set({
                    file: fileName,
                    status: 'success',
                })
                .where(eq(drizzleDb.schemas.backup.id, backup.id));

            eventEmitter.emit('modification', {update: true});

            return NextResponse.json(
                {
                    message: "Backup successfully uploaded",
                },
                {status: 200}
            );
        } else {

            await db
                .update(drizzleDb.schemas.backup)
                .set({status: 'failed'})
                .where(eq(drizzleDb.schemas.backup.id, backup.id));

            eventEmitter.emit('modification', {update: true});

            return NextResponse.json(
                {
                    message: "Backup successfully updated with status failed",
                },
                {status: 200}
            );
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}