"use client"

import {PropsWithChildren} from "react";
import {ThemeProvider} from "@/features/theme/theme-provider";

import {Toaster} from "@/components/ui/sonner";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {SessionProvider} from "next-auth/react";

export type ProviderProps = PropsWithChildren<{}>;
const queryClient = new QueryClient()

export const Providers = (props: ProviderProps) => {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                // disableTransitionOnChange
            >
                <QueryClientProvider client={queryClient}>
                    <Toaster/>
                    {props.children}
                </QueryClientProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}
