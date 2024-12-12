'use client'

import {type ReactNode, createContext, useRef} from 'react'

import {useStore} from '@/state-management/store'

export type GlobalStoreApi = ReturnType<typeof useStore>

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(
    undefined,
)

export interface CounterStoreProviderProps {
    children: ReactNode
}

export const GlobalStoreProvider = ({
                                         children,
                                     }: CounterStoreProviderProps) => {
    const storeRef = useRef<GlobalStoreApi>()
    if (!storeRef.current) {
        storeRef.current = useStore()
    }

    return (
        <GlobalStoreContext.Provider value={storeRef.current}>
            {children}
        </GlobalStoreContext.Provider>
    )
}

