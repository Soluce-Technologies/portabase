import {z} from "zod";
import {
    findBlockedBackend,
    parseRemoteNames,
} from "@/features/channel/components/storages/rclone/rclone.parse";

export const RcloneChannelConfigSchema = z
    .object({
        configText: z.string().trim().min(1, "rclone config is required"),
        remoteName: z.string().trim().min(1, "Remote name is required"),
        // Optional. Empty means the destination falls back to the global backup
        // folder (BACKUP_FOLDER_NAME, default "backups"), which the dashboard
        // already sends as folderName on every channel.
        remotePath: z.string().trim().optional().default(""),
    })
    .superRefine((value, ctx) => {
        const remotes = parseRemoteNames(value.configText);

        if (remotes.length === 0) {
            ctx.addIssue({
                code: "custom",
                path: ["configText"],
                message: "No remote found. The config must contain at least one [section] header.",
            });
            return;
        }

        const blocked = findBlockedBackend(value.configText);
        if (blocked) {
            ctx.addIssue({
                code: "custom",
                path: ["configText"],
                message: `Backend type "${blocked.type}" is not allowed (remote "${blocked.remote}").`,
            });
        }

        if (value.remoteName && !remotes.includes(value.remoteName)) {
            ctx.addIssue({
                code: "custom",
                path: ["remoteName"],
                message: `Remote "${value.remoteName}" is not defined in the config. Available: ${remotes.join(", ")}.`,
            });
        }
    });
