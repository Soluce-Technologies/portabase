import React from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Providers} from "./providers";
import {cn} from "@/lib/utils";
import {ConsoleSilencer} from "@/components/wrappers/common/console-silencer";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_PROJECT_NAME ?? "App Title",
    description: process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION ?? undefined,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta name="apple-mobile-web-app-title" content="Portabase"/>
        </head>
        <body className={cn(inter.className, "h-full")}>
        <ConsoleSilencer/>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
