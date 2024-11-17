import {z} from "zod";

const ImmediateExecutionSchema = z.object({
    executionMode: z.literal('immediate'),
});

const ScheduledExecutionSchema = z.object({
    executionMode: z.literal('scheduled'),
    scheduledDatetime: z.date(),
});

const CommonBackupSchema = z.union([ImmediateExecutionSchema, ScheduledExecutionSchema]);

const RemoteBackupSchema = z.object({
    backupLocation: z.literal('remote-file'),
}).merge(CommonBackupSchema);

const DesktopBackupSchema = z.object({
    backupLocation: z.literal('desktop-file'),
    uploadedBackupFile: z.instanceof(File),
}).merge(CommonBackupSchema);

export const RestoreSchema = z.union([RemoteBackupSchema, DesktopBackupSchema]);
export type RestoreType = z.infer<typeof RestoreSchema>;
