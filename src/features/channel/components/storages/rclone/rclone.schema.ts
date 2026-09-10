import {z} from "zod";
import {
    findBlockedBackend,
    parseRemoteNames,
} from "@/features/channel/components/storages/rclone/rclone.parse";

export const RcloneChannelConfigSchema = z
    .object({
        configText: z.string().trim().min(1, "rclone config is required"),
        // Derived from the single [section] header rather than chosen by the
        // user; the form writes it. Still part of the stored config because it
        // is the contract the agent deserializes as `remote_name`.
        remoteName: z.string().trim().min(1, "Remote name is required"),
        // Optional. Empty means the destination falls back to the global backup
        // folder (BACKUP_FOLDER_NAME, default "backups"), which the dashboard
        // already sends as folderName on every channel.
        remotePath: z.string().trim().optional().default(""),
    })
    .superRefine((value, ctx) => {
        const remotes = parseRemoteNames(value.configText);

        // Exactly one remote per channel. Chained remotes (crypt, chunker) are
        // deliberately out of scope: Portabase already encrypts backups, so the
        // common chaining case is redundant work for the user.
        if (remotes.length !== 1) {
            ctx.addIssue({
                code: "custom",
                path: ["configText"],
                message:
                    remotes.length === 0
                        ? "No remote found. The config must contain exactly one [section] header."
                        : `Paste exactly one [section]. Found ${remotes.length}: ${remotes.join(", ")}.`,
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

        if (value.remoteName && value.remoteName !== remotes[0]) {
            ctx.addIssue({
                code: "custom",
                path: ["configText"],
                message: `Remote "${value.remoteName}" does not match the pasted section "${remotes[0]}".`,
            });
        }
    });
