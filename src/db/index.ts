import {drizzle} from "drizzle-orm/node-postgres";

import * as settings from "./schema/01_setting";
import * as user from "./schema/02_user";
import * as organisation from "./schema/03_organization";
import * as invitation from "./schema/04_member";
import * as member from "./schema/05_invitation";
import * as project from "./schema/06_project";
import * as agent from "./schema/08_agent";
import * as database from "./schema/07_database";


import {Pool} from "pg";

// Do not delete
import dotenv from "dotenv";
import {migrate} from "drizzle-orm/node-postgres/migrator";

dotenv.config({
    path: ".env",
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const schemas = {
    ...settings,
    ...user,
    ...organisation,
    ...invitation,
    ...member,
    ...project,
    ...agent,
    ...database
};

export const db = drizzle({
    client: pool,
    logger: process.env.NODE_ENV != 'production',
    schema: schemas,
});

export async function makeMigration() {
    if (process.env.NODE_ENV != "development") {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL!,
        });

        const database = drizzle({client: pool});

        console.log("Running migrations...");
        try {
            await migrate(database, {migrationsFolder: "./src/db/migrations"});
            console.log("Migrations applied successfully.");
        } catch (error) {
            console.error("Error applying migrations:", error);
        }
    }
}
