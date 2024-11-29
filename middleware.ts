import {NextRequest, NextResponse} from 'next/server'
import {loggingMiddleware} from "@/middleware/loggingMiddleware";
import {errorHandler} from "@/middleware/errorHandler";

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // Exclude `/api/auth` and its subpaths
    if (url.pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (url.pathname.startsWith('/api')) {

        const routeExists = checkRouteExists(url.pathname);
        // If the route does not exist, return a 404 JSON response
        if (!routeExists) {
            return new NextResponse(
                JSON.stringify({ message: "This API route does not exist.", status: 404 }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }
    try{
        loggingMiddleware(request);
    }catch(err){
        errorHandler(err)
    }


}
// Function to check if the route exists (supports dynamic routes)
function checkRouteExists(pathname) {
    // Define static and dynamic routes with patterns
    const routePatterns = [
        //do not delete
        // /^\/api\/auth\/\d+$/,        // Dynamic route with a number as a parameter (e.g., /api/dynamic/123)
        // /^\/api\/auth\/\w+$/,        // Dynamic route with a number as a parameter (e.g., /api/dynamic/123)
        // /^\/api\/agent\/healthcheck\/\w+$/,           // Dynamic route with an alphanumeric parameter (e.g., /api/user/username)
        /^\/api\/agent\/[^/]+\/status\/?$/,   // Dynamic route for /api/agent/[id]/status
        /^\/api\/agent\/[^/]+\/backup\/?$/,   // Dynamic route for /api/agent/[id]/status
        /^\/api\/files\/[^/]+\/?$/,
    ];
    return routePatterns.some(pattern => pattern.test(pathname));
}


export const config = {
    matcher: [
        // '/api/agent/:path*',
        '/api/:path*',
    ],
};