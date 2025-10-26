import * as fs from "node:fs";
import {NextResponse} from "next/server";
import path from "path";

export async function GET(
    request: Request,
    {params}: { params: Promise<{ fileName: string }> }
) {

    const {searchParams} = new URL(request.url);
    const token = searchParams.get('token');
    const expires = searchParams.get('expires');
    const fileName = (await params).fileName

    console.log(token);
    console.log(fileName);

    const uploadsDir = "private/uploads/files/";
    const keysDir = "private/keys/";
    const uploadPath = path.join(uploadsDir, fileName);
    const keyPath = path.join(keysDir, fileName);

    const crypto = require('crypto');

    let filePath = uploadPath;
    if (!fs.existsSync(uploadPath)) {
        if (fs.existsSync(keyPath)) filePath = keyPath;
        else
            return NextResponse.json({error: "File not found"}, {status: 404});
    }

    const expectedToken = crypto.createHash('sha256').update(`${fileName}${expires}`).digest('hex');
    if (token !== expectedToken) {
        return NextResponse.json(
            {error: 'Invalid signed token'},
            {status: 403}
        );
    }
    //@ts-ignore
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


