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
        NEXT_PUBLIC_SECRET: z.string(),
        NEXTAUTH_URL: z.string(),

        SMTP_PASSWORD: z.string().optional(),
        SMTP_FROM: z.string().optional(),
        SMTP_HOST: z.string().optional(),
        SMTP_PORT: z.string().optional(),
        SMTP_USER: z.string().optional(),

        AUTH_GOOGLE_ID: z.string().optional(),
        AUTH_GOOGLE_SECRET: z.string().optional(),

        S3_ENDPOINT: z.string().optional(),
        S3_ACCESS_KEY: z.string().optional(),
        S3_SECRET_KEY: z.string().optional(),
        S3_BUCKET_NAME: z.string().optional(),
        S3_PORT: z.string().optional(),
        S3_USE_SSL: z.string().optional(),

        STORAGE_TYPE: z.string().optional(),
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
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_DOMAIN_NAME: process.env.NEXT_PUBLIC_DOMAIN_NAME,
        DATABASE_URL: process.env.DATABASE_URL,

        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_FROM: process.env.SMTP_FROM,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,

        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

        S3_ENDPOINT: process.env.S3_ENDPOINT,
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
        S3_SECRET_KEY: process.env.S3_SECRET_KEY,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_PORT: process.env.S3_PORT,
        S3_USE_SSL: process.env.S3_USE_SSL,

        STORAGE_TYPE: process.env.STORAGE_TYPE,
    },
});
