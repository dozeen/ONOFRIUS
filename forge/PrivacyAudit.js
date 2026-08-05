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

const RULES = [

    {
        name: "Owner Name",
        regex: /\bOnofrio\b/gi
    },

    {
        name: "Dolly",
        regex: /\bDolly\b/gi
    },

    {
        name: "Silvana",
        regex: /\bSilvana\b/gi
    },

    {
        name: "Phone Number",
        regex: /\+?\d{9,15}/g
    },

    {
        name: ".env",
        regex: /\.env/g
    },

    {
        name: ".wwebjs_auth",
        regex: /\.wwebjs_auth/g
    }

];

let critical = 0;

function shouldIgnore(fullPath) {

    return IGNORE.some(name =>
        fullPath.includes("/" + name + "/") ||
        fullPath.endsWith("/" + name) ||
        fullPath.includes("\\" + name + "\\")
    );

}

function scan(dir) {

    for (const file of fs.readdirSync(dir)) {

        const full = path.join(dir, file);

        if (shouldIgnore(full))
            continue;

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

        for (const rule of RULES) {

            rule.regex.lastIndex = 0;

            if (!rule.regex.test(text))
                continue;

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

            return {
                success: true,
                critical: 0
            };

        }

        console.log("❌ Critical issues:", critical);

        return {

            success: false,
            critical

        };

    }

};
