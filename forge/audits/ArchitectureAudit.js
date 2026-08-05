const AuditResult = require("../models/AuditResult");
const fs = require("fs");
const path = require("path");

module.exports = {

    async run() {

        const result = new AuditResult("Architecture Audit");

        scan("core", result);

        return result;

    }

};

function scan(dir, result) {

    if (!fs.existsSync(dir))
        return;

    for (const file of fs.readdirSync(dir)) {

        const full = path.join(dir, file);

        const stat = fs.statSync(full);

        if (stat.isDirectory()) {

            scan(full, result);
            continue;

        }

        if (!file.endsWith(".js"))
            continue;

        const text = fs.readFileSync(full, "utf8");

        const matches = text.match(/require\(["'](\.\.\/){2,}/g);

        if (matches) {

            result.warnings.push({

                file: full,

                message: "Deep relative require detected"

            });

        }

    }

}
