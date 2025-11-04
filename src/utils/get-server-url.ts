import { env } from "@/env.mjs";

export const getServerUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    if (env.NODE_ENV === "development") {
        return `${env.PROJECT_URL}`;
    }
    return `${env.PROJECT_URL}`;
};
