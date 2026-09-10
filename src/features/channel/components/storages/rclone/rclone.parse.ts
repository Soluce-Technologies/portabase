/**
 * Backends that would give a storage channel read/write access to the container
 * filesystem outside the intended paths. The agent enforces the same list on its
 * side, because it receives this config over the wire.
 */
export const BLOCKED_BACKEND_TYPES = ["local", "alias"] as const;

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
