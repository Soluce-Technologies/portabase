import type {Metadata} from "next";
import "./globals.css";
import {Providers} from "./providers";
import {cn} from "@/lib/utils";
import {Inter} from "next/font/google";


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Portabase",
    description: "Manage all your database instances from one place !",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "h-full")}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
