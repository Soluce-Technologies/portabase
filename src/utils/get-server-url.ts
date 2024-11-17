import {env} from "@/env.mjs";

export const getServerUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return `https://${env.NEXT_PUBLIC_DOMAIN_NAME}`;
}