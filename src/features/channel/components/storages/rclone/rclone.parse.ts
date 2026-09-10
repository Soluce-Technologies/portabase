/**
 * Backend types a storage channel may not use.
 *
 * Kept in lockstep with `BLOCKED_BACKEND_TYPES` in the agent's
 * `src/services/storage/providers/rclone/helpers.rs`. Enforced on both sides,
 * because the agent receives this config over the wire and must not trust it.
 *
 * Three groups:
 *  - `local` / `alias` reach the container filesystem directly.
 *  - The wrapping ("virtual") backends each need a second remote to wrap, which
 *    a single-section channel config cannot supply — and several of them accept
 *    a bare local path as that remote, which would otherwise walk straight past
 *    the `local` entry above.
 *  - `memory`, `http` and `googlephotos` cannot hold a backup: in-RAM and lost
 *    on exit, read-only, and media-only-with-rewriting respectively.
 */
export const BLOCKED_BACKEND_TYPES = [
    "local",
    "alias",
    "crypt",
    "chunker",
    "compress",
    "union",
    "combine",
    "hasher",
    "archive",
    "cache",
    "memory",
    "http",
    "googlephotos",
] as const;

type Section = { name: string; type: string | null };

/** Section headers and their `type =` values, in file order. */
function parseSections(configText: string): Section[] {
    const sections: Section[] = [];

    for (const raw of configText.split("\n")) {
        const line = raw.trim();

        if (line.startsWith("[") && line.endsWith("]") && line.length > 2) {
            sections.push({name: line.slice(1, -1).trim(), type: null});
            continue;
        }

        const eq = line.indexOf("=");
        if (eq === -1) continue;

        const current = sections[sections.length - 1];
        if (!current || current.type !== null) continue;

        if (line.slice(0, eq).trim().toLowerCase() === "type") {
            current.type = line.slice(eq + 1).trim().toLowerCase();
        }
    }

    return sections;
}

/** Remote names defined in the config, for the form's dropdown. */
export function parseRemoteNames(configText: string): string[] {
    return parseSections(configText).map((s) => s.name).filter(Boolean);
}

/**
 * The first section using a blocked backend, or null. Every section is checked,
 * not only the selected remote — a crypt remote can wrap a local one.
 */
export function findBlockedBackend(configText: string): { remote: string; type: string } | null {
    for (const section of parseSections(configText)) {
        if (section.type && (BLOCKED_BACKEND_TYPES as readonly string[]).includes(section.type)) {
            return {remote: section.name, type: section.type};
        }
    }
    return null;
}
