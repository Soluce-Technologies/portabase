import {db} from "@/db";
import * as drizzleDb from "@/db";

export const retentionCleanTask = async () => {
    try {
        const projects = await db.query.project.findMany();
        console.log(projects);

    } catch (e: any) {
        throw e;
    }
}