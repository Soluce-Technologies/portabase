import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: Promise<{ fileName: string }> }) {
    try {
        const fileName = (await params).fileName;
        const filePath = path.join(process.cwd(), "private/uploads/images", fileName);

        // Check if the file exists
        try {
            await fs.access(filePath); // Ensures the file exists
        } catch {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Read the file
        const fileContent = await fs.readFile(filePath); // Returns a Buffer

        return new NextResponse(fileContent, {
            headers: {
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Type": "application/octet-stream", // Adjust MIME type as needed
            },
        });
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
