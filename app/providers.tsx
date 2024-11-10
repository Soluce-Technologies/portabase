"use client"

import {PropsWithChildren} from "react";

import {Toaster} from "@/components/ui/sonner";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {SessionProvider} from "next-auth/react";

export type ProviderProps = PropsWithChildren<{}>;
const queryClient = new QueryClient()

import dynamic from 'next/dynamic';

const ThemeProvider = dynamic(() => import('@/features/theme/theme-provider'), {ssr: false});

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
