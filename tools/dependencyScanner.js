const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const ignore = new Set([
    "node_modules",
    ".git",
    ".wwebjs_auth",
    ".wwebjs_cache",
    "release",
    "backup"
]);

function getScannerPatterns() {
    const patterns = [
        "config/",
        "config.",
        "owner",
        "contacts",
        "memory/",
        ".env",
        ".wwebjs_auth",
        "session-gordon"
    ];

    const ownerPath = path.join(ROOT, "config", "owner.json");
    if (fs.existsSync(ownerPath)) {
        try {
            const owner = JSON.parse(fs.readFileSync(ownerPath, "utf8"));
            if (owner.name) patterns.push(owner.name);
            if (Array.isArray(owner.aliases)) patterns.push(...owner.aliases);
        } catch (e) {}
    }
    return patterns;
}

function scan(dir) {
    const patterns = getScannerPatterns();

    for (const file of fs.readdirSync(dir)) {
        if (ignore.has(file)) continue;

        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            scan(full);
            continue;
        }

        if (!file.endsWith(".js")) continue;

        const txt = fs.readFileSync(full, "utf8");
        for (const p of patterns) {
            if (txt.includes(p)) {
                console.log(full);
                break;
            }
        }
    }
}

scan(ROOT);
