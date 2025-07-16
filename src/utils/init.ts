import { env } from "@/env.mjs";
import {db, makeMigration} from "@/db";
import { eq } from "drizzle-orm";
import * as drizzleDb from "@/db";


export async function init() {
    consoleAscii();
    console.log("====Init Functions====");
    await makeMigration();
    await createDefaultOrganization();
    await createSettingsIfNotExist()
        .then(() => {
            console.log("====Initialization completed====");
        })
        .catch((err) => {
            console.error("Error during initialization:", err);
        });
}

async function createSettingsIfNotExist() {
    const configSettings = {
        name: "system",
        smtpPassword: env.SMTP_PASSWORD ?? null,
        smtpFrom: env.SMTP_FROM ?? null,
        smtpHost: env.SMTP_HOST ?? null,
        smtpPort: env.SMTP_PORT ?? null,
        smtpUser: env.SMTP_USER ?? null,
        s3EndPointUrl: env.S3_ENDPOINT ?? null,
        s3AccessKeyId: env.S3_ACCESS_KEY ?? null,
        s3SecretAccessKey: env.S3_SECRET_KEY ?? null,
        S3BucketName: env.S3_BUCKET_NAME ?? null,
    };

    const [existing] = await db.select().from(drizzleDb.schemas.setting).where(eq(drizzleDb.schemas.setting.name, "system")).limit(1);

    if (!existing) {
        console.log("====Init Setting : Create ====");
        await db.insert(drizzleDb.schemas.setting).values(configSettings);
    } else {
        console.log("====Init Setting : Update ====");
        await db.update(drizzleDb.schemas.setting).set(configSettings).where(eq(drizzleDb.schemas.setting.name, "system"));
    }
}

async function createDefaultOrganization() {
    const defaultOrganizationConf = {
        slug: "default",
        name: "Default Organization",
        createdAt: new Date(),
    };

    const [existing] = await db.select().from(drizzleDb.schemas.organization).where(eq(drizzleDb.schemas.organization.slug, "default")).limit(1);

    if (!existing) {
        console.log("==== Creating default Organization... ====\n");
        await db.insert(drizzleDb.schemas.organization).values(defaultOrganizationConf);
    }
}

function consoleAscii() {
    console.log(
        "\n" +
            "    ____                __          __                          _____                               \n" +
            "   / __ \\ ____   _____ / /_ ____ _ / /_   ____ _ _____ ___     / ___/ ___   _____ _   __ ___   _____\n" +
            "  / /_/ // __ \\ / ___// __// __  // __ \\ / __  // ___// _ \\    \\__ \\ / _ \\ / ___/| | / // _ \\ / ___/\n" +
            " / ____// /_/ // /   / /_ / /_/ // /_/ // /_/ /(__  )/  __/   ___/ //  __// /    | |/ //  __// /    \n" +
            "/_/     \\____//_/    \\__/ \\__,_//_.___/ \\__,_//____/ \\___/   /____/ \\___//_/     |___/ \\___//_/     \n" +
            "                                                                                                    \n"
    );
}
