import {persist} from "zustand/middleware";

import {create} from "zustand";

export type GlobalState = {
    organizationId: string
}

export type GlobalActions = {
    moveToAnotherOrganization: (id: string) => void
}

export type GlobalStore = GlobalState & GlobalActions

export const defaultInitState: GlobalState = {
    organizationId: "",
}

export const useStore = create<GlobalStore>()(
    persist(
        (set) => ({
            ...defaultInitState,
            moveToAnotherOrganization: (id: string) => set((state) => ({organizationId: id})),
        }),
        {
            name: "global-storage",

        }
    )
);