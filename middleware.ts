import { NextRequest, NextResponse } from "next/server";
import { loggingMiddleware } from "@/middleware/loggingMiddleware";
import { errorHandler } from "@/middleware/errorHandler";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { signOut } from "@/lib/auth/auth-client";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const redirectUrl = encodeURIComponent(request.nextUrl.pathname)

    if (url.pathname.startsWith("/dashboard")) {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.redirect(new URL(`/login?redirect=${redirectUrl}`, request.url));
        }

        if (session.user.banned) {
            signOut();
            return NextResponse.redirect(new URL("/login?error=banned", request.url));
        }

        if (session.user.role === "pending") {
            signOut();
            return NextResponse.redirect(new URL(`/login?error=pending?redirect=${redirectUrl}`, request.url));
        }

        if (url.pathname === "/dashboard") {
            return NextResponse.redirect(new URL(`/dashboard/home`, request.url));
        }

        return NextResponse.next();
    }

    // Exclude `/api/auth` and its subpaths
    if (url.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    if (url.pathname.startsWith("/api")) {
        const routeExists = checkRouteExists(url.pathname);
        // If the route does not exist, return a 404 JSON response
        if (!routeExists) {
            return new NextResponse(JSON.stringify({ message: "This API route does not exist.", status: 404 }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    try {
        loggingMiddleware(request);
    } catch (err) {
        errorHandler(err);
    }
}
// Function to check if the route exists (supports dynamic routes)
function checkRouteExists(pathname: string) {
    // Define static and dynamic routes with patterns
    const routePatterns = [
        //do not delete
        // /^\/api\/auth\/\d+$/,        // Dynamic route with a number as a parameter (e.g., /api/dynamic/123)
        // /^\/api\/auth\/\w+$/,        // Dynamic route with a number as a parameter (e.g., /api/dynamic/123)
        // /^\/api\/agent\/healthcheck\/\w+$/,           // Dynamic route with an alphanumeric parameter (e.g., /api/user/username)
        /^\/api\/agent\/[^/]+\/status\/?$/, // Dynamic route for /api/agent/[id]/status
        /^\/api\/agent\/[^/]+\/backup\/?$/,
        /^\/api\/agent\/[^/]+\/restore\/?$/,
        /^\/api\/files\/[^/]+\/?$/,
        /^\/api\/images\/[^/]+\/?$/,
        /^\/api\/events\/?$/,
        /^\/api\/init\/?$/,
    ];
    return routePatterns.some((pattern) => pattern.test(pathname));
}

export const config = {
    runtime: "nodejs",
    matcher: [
        // '/api/agent/:path*',
        "/api/:path*",
        "/dashboard/:path*",
        "/dashboard",
    ],
};
