import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    /*
     * Serverside Environment variables, not available on the client.
     * Will throw if you access these variables on the client.
     */
    server: {
        NODE_ENV: z.enum(['development', 'production']),
        DATABASE_URL: z.string().url(),
        SMTP_PASSWORD: z.string(),
        SMTP_FROM: z.string(),
        SMTP_HOST: z.string(),
        SMTP_PORT: z.string(),
        SMTP_USER: z.string(),
        NEXT_PUBLIC_SECRET: z.string()
    },
    /*
     * Environment variables available on the client (and server).
     *
     * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
     */
    client: {
        NEXT_PUBLIC_DOMAIN_NAME: z.string(),
    },
    /*
     * Due to how Next.js bundles environment variables on Edge and Client,
     * we need to manually destructure them to make sure all are included in bundle.
     *
     * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
     */
    runtimeEnv: {
        NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_DOMAIN_NAME: process.env.NEXT_PUBLIC_DOMAIN_NAME,
        DATABASE_URL: process.env.DATABASE_URL,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_FROM: process.env.SMTP_FROM,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
    },
});
