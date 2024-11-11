import { NextRequest, NextResponse } from 'next/server';

export function loggingMiddleware(request: NextRequest) {
    if (request.url.includes('/api')) {
        console.log(`[API] Received ${request.method} request : ${request.url} at ${new Date()}`);
    }
    return NextResponse.next();
}