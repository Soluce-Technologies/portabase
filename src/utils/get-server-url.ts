import { env } from "@/env.mjs";

export const getServerUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    if (env.NODE_ENV === "development") {
        return `${env.NEXT_PUBLIC_PROJECT_URL}`;
    }
    return `${env.NEXT_PUBLIC_PROJECT_URL}`;
};
