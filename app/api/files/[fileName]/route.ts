import * as fs from "node:fs";
import {NextResponse} from "next/server";
import path from "path";

export async function GET(
    request: Request,
    {params}: { params: Promise<{ fileName: string }> }
) {

    // Retrieve params
    const {searchParams} = new URL(request.url);
    const token = searchParams.get('token');
    const expires = searchParams.get('expires');
    const fileName = (await params).fileName


    const privateLocalDir = "private/uploads/";
    const filePath = path.join(privateLocalDir, fileName);

    const crypto = require('crypto');


    if (!fs.existsSync(filePath)) {
        return NextResponse.json(
            {error: 'File not found'},
            {status: 404}
        );
    }

    const expectedToken = crypto.createHash('sha256').update(`${fileName}${expires}`).digest('hex');
    if (token !== expectedToken) {
        return NextResponse.json(
            {error: 'Invalid signed token'},
            {status: 403}
        );
    }

    const expiresAt = parseInt(expires, 10);
    if (Date.now() > expiresAt) {
        return NextResponse.json(
            {error: 'Signed token expired'},
            {status: 403}
        );
    }

    const fileStream = fs.createReadStream(filePath);
    const stream = new ReadableStream({
        start(controller) {
            fileStream.on('data', (chunk) => controller.enqueue(chunk));
            fileStream.on('end', () => controller.close());
            fileStream.on('error', (err) => controller.error(err));
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': 'application/octet-stream',
        },
    });
}