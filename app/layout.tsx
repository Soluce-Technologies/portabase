import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import {Providers} from "./providers";
import {cn} from "@/lib/utils";
import {ConsoleSilencer} from "@/components/wrappers/common/console-silencer";
import {inter} from "@/fonts/fonts";

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_PROJECT_NAME ?? "Portabase",
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
