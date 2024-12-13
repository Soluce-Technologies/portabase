import {z} from "zod";

const cronRegex = /^(\d{1,2}|\*|(\d{1,2}-\d{1,2})|(\d{1,2}\/\d{1,2}))\s+(\d{1,2}|\*|(\d{1,2}-\d{1,2})|(\d{1,2}\/\d{1,2}))\s+(\d{1,2}|\*|(\d{1,2}-\d{1,2})|(\d{1,2}\/\d{1,2}))\s+(\d{1,7}|\*|(\d{1,7}-\d{1,7})|(\d{1,7}\/\d{1,7}))$/;


export const DatabaseSchema = z.object({
    name: z.string().readonly(),
    description: z.string().optional(),
    dbms: z.string().readonly(),
});

export type DatabaseType = z.infer<typeof DatabaseSchema>;
