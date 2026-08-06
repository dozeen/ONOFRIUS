const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const IGNORE = [
    ".git",
    "node_modules",
    ".wwebjs_auth",
    "release",
    "backup",
    "publish",
    "tools",
    "archive"
];

function getOwnerForbiddenRules() {
    const rules = [];
    const ownerPath = path.join(ROOT, "config", "owner.json");
    if (fs.existsSync(ownerPath)) {
        try {
            const owner = JSON.parse(fs.readFileSync(ownerPath, "utf8"));
            const names = [owner.name, ...(owner.aliases || [])].filter(Boolean);
            if (names.length > 0) {
                const pattern = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
                rules.push({
                    name: "Hardcoded Owner Data",
                    regex: new RegExp(`\\b(${pattern})\\b`, 'gi')
                });
            }
        } catch (e) {}
    }
    rules.push(
        { name: "Phone Number", regex: /\+?\d{9,15}/g },
        { name: ".env File", regex: /\.env/g },
        { name: ".wwebjs_auth", regex: /\.wwebjs_auth/g }
    );
    return rules;
}

let critical = 0;

function shouldIgnore(fullPath) {
    return IGNORE.some(name =>
        fullPath.includes("/" + name + "/") ||
        fullPath.endsWith("/" + name) ||
        fullPath.includes("\\" + name + "\\")
    );
}

function scan(dir) {
    const rules = getOwnerForbiddenRules();

    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file);
        if (shouldIgnore(full)) continue;

        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            scan(full);
            continue;
        }

        let text = "";
        try {
            text = fs.readFileSync(full, "utf8");
        } catch {
            continue;
        }

        for (const rule of rules) {
            rule.regex.lastIndex = 0;
            if (!rule.regex.test(text)) continue;

            console.log("");
            console.log("❌", rule.name);
            console.log(full);
            critical++;
        }
    }
}

module.exports = {
    async run() {
        console.log("");
        console.log("══════════════════════════════");
        console.log(" PRIVACY AUDIT");
        console.log("══════════════════════════════");

        scan(ROOT);

        console.log("");
        if (critical === 0) {
            console.log("✅ Privacy Audit PASSED");
            return { success: true, critical: 0 };
        }

        console.log("❌ Critical issues:", critical);
        return { success: false, critical };
    }
};
