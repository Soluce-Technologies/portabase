// --- Zod Schema ---
import {z} from "zod";

export const gfsSettingsSchema = z.object({
    daily: z.number().min(1).max(31),
    weekly: z.number().min(0).max(52),
    monthly: z.number().min(0).max(120),
    yearly: z.number().min(0).max(50),
})

export const retentionSettingsSchema = z.object({
    type: z.enum(["count", "days", "gfs"]),
    count: z.number().min(1).max(100),
    days: z.number().min(1).max(3650),
    gfs: gfsSettingsSchema,
})

export type RetentionSettings = z.infer<typeof retentionSettingsSchema>
