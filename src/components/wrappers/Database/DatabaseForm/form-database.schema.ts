import {z} from "zod";

const cronRegex = /^(\d{1,2}|\*|(\d{1,2}-\d{1,2})|(\d{1,2}\/\d{1,2}))\s+(\d{1,2}|\*|(\d{1,2}-\d{1,2})|(\d{1,2}\/\d{1,2}))\s+(\d{1,2}|\*|(\d{1,2}-\d{1,2})|(\d{1,2}\/\d{1,2}))\s+(\d{1,7}|\*|(\d{1,7}-\d{1,7})|(\d{1,7}\/\d{1,7}))$/;


export const DatabaseSchema = z.object({
    name: z.string(),
    description: z.string().optional().nullable(),
    dbms: z.string(),
    backupPolicy: z.string().regex(cronRegex, 'Invalid cron format')
});

export type DatabaseType = z.infer<typeof DatabaseSchema>;
