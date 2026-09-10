#!/usr/bin/env node
// Ad-hoc assertion checks for the rclone dashboard provider. Not a test
// framework, no new dependency — plain `node scripts/verify-rclone.mjs`.
//
// `statFound` gates both restore and backup-presence checking and has
// already shipped one wrong version plus one hardening; this file exists so
// its behaviour (and the config parser's) is pinned to something runnable
// instead of re-verified ad hoc each time.

import assert from "node:assert";
import path from "node:path";
import {spawnSync} from "node:child_process";

// `rclone.parse.ts` has no non-type-only TS syntax, so Node can import it
// directly once type stripping is enabled. Re-exec once with the flag so
// `node scripts/verify-rclone.mjs` (no flags) keeps working, and so this
// script imports the real exported functions instead of copying them.
if (!process.execArgv.includes("--experimental-strip-types") && !process.env.VERIFY_RCLONE_RESPAWNED) {
    const result = spawnSync(
        process.execPath,
        ["--experimental-strip-types", "--no-warnings", process.argv[1], ...process.argv.slice(2)],
        {stdio: "inherit", env: {...process.env, VERIFY_RCLONE_RESPAWNED: "1"}},
    );
    process.exit(result.status ?? 1);
}

const {parseRemoteNames, findBlockedBackend} = await import(
    "../src/features/channel/components/storages/rclone/rclone.parse.ts"
);

// --- Mirrors of module-private helpers from rclone/index.ts -----------------
// `target` and `findRemoteBasename`/`statFound` are not exported. These are
// plain copies of their logic and MUST be kept in sync with
// src/features/channel/components/storages/rclone/index.ts by hand.

/** Mirrors `target()` in rclone/index.ts. */
function target(config, filePath) {
    const base = (config.remotePath ?? "").trim().replace(/^\/+|\/+$/g, "");
    return base
        ? `${config.remoteName}:${base}/${filePath}`
        : `${config.remoteName}:${filePath}`;
}

/** Mirrors `statFound()` in rclone/index.ts. */
function statFound(stat, remotePath) {
    if (stat.code !== 0) return false;

    let parsed;
    try {
        parsed = JSON.parse(stat.stdout.toString());
    } catch {
        return false;
    }

    if (typeof parsed !== "object" || parsed === null) return false;
    const {IsDir, Name} = parsed;
    const expected = path.basename(remotePath.split(":").pop() ?? remotePath);
    return IsDir === false && Name === expected;
}

// --- Checks ------------------------------------------------------------

const checks = [];
function check(name, fn) {
    checks.push({name, fn});
}

const S3_SECTION = "[minio]\ntype = s3\nprovider = Minio\naccess_key_id = x\nsecret_access_key = y\n";

check("parseRemoteNames: single-section config", () => {
    assert.deepStrictEqual(parseRemoteNames(S3_SECTION), ["minio"]);
});

check("parseRemoteNames: chained crypt-over-s3 config", () => {
    const cfg = `[secret]\ntype = crypt\nremote = minio:bucket\n\n${S3_SECTION}`;
    assert.deepStrictEqual(parseRemoteNames(cfg), ["secret", "minio"]);
});

check("findBlockedBackend: catches local", () => {
    const cfg = "[disk]\ntype = local\n";
    assert.deepStrictEqual(findBlockedBackend(cfg), {remote: "disk", type: "local"});
});

check("findBlockedBackend: catches alias", () => {
    const cfg = "[shortcut]\ntype = alias\nremote = other:path\n";
    assert.deepStrictEqual(findBlockedBackend(cfg), {remote: "shortcut", type: "alias"});
});

check("findBlockedBackend: catches a blocked backend in a section that is not the named one", () => {
    // The chosen remote is a plain s3 section, but a second section declares a
    // local backend. findBlockedBackend must scan every section, not just the
    // one the channel names.
    const cfg = `${S3_SECTION}\n[disk]\ntype = local\n`;
    assert.deepStrictEqual(findBlockedBackend(cfg), {remote: "disk", type: "local"});
});

check("findBlockedBackend: catches a wrapping backend pointing at a bare local path", () => {
    // The escape that the "local" entry alone does not catch: no section
    // declares type = local, but rclone would still read and write the
    // container filesystem through the wrapping backend.
    for (const backend of ["crypt", "chunker", "compress", "union", "combine", "hasher"]) {
        const cfg = `[sneaky]\ntype = ${backend}\nremote = /etc\n`;
        assert.deepStrictEqual(
            findBlockedBackend(cfg),
            {remote: "sneaky", type: backend},
            `${backend} must be rejected`,
        );
    }
});

check("findBlockedBackend: catches backends that cannot hold a backup", () => {
    for (const backend of ["memory", "http", "googlephotos"]) {
        const cfg = `[nope]\ntype = ${backend}\n`;
        assert.deepStrictEqual(
            findBlockedBackend(cfg),
            {remote: "nope", type: backend},
            `${backend} must be rejected`,
        );
    }
});

check("findBlockedBackend: null for a clean s3 config", () => {
    assert.strictEqual(findBlockedBackend(S3_SECTION), null);
});

check("target(): empty remotePath", () => {
    assert.strictEqual(target({remoteName: "r", remotePath: ""}, "a/b.bin"), "r:a/b.bin");
});

check("target(): one-segment prefix", () => {
    assert.strictEqual(target({remoteName: "r", remotePath: "my-bucket"}, "a/b.bin"), "r:my-bucket/a/b.bin");
});

check("target(): slash-padded prefix", () => {
    assert.strictEqual(target({remoteName: "r", remotePath: "/my-bucket/"}, "a/b.bin"), "r:my-bucket/a/b.bin");
});

check("statFound(): real hit payload -> true", () => {
    const stat = {
        code: 0,
        stdout: Buffer.from(JSON.stringify({Path: "portabase-ping.txt", Name: "portabase-ping.txt", Size: 4, IsDir: false})),
        stderr: "",
    };
    assert.strictEqual(statFound(stat, "minio:backups/portabase-ping.txt"), true);
});

check("statFound(): real miss payload -> false", () => {
    const stat = {
        code: 0,
        stdout: Buffer.from(JSON.stringify({Path: "", Name: "", Size: -1, IsDir: true})),
        stderr: "",
    };
    assert.strictEqual(statFound(stat, "minio:backups/portabase-ping.txt"), false);
});

let failures = 0;
for (const {name, fn} of checks) {
    try {
        fn();
        console.log(`ok - ${name}`);
    } catch (err) {
        failures++;
        console.error(`FAIL - ${name}`);
        console.error(err);
    }
}

if (failures > 0) {
    console.error(`\n${failures}/${checks.length} checks failed`);
    process.exit(1);
}

console.log(`\nAll rclone verification checks passed (${checks.length}/${checks.length})`);
