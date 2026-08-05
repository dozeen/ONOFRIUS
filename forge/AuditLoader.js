const fs = require("fs");
const path = require("path");

module.exports = {

    load() {

        const audits = [];

        const dir = path.join(__dirname, "audits");

        for (const file of fs.readdirSync(dir).sort()) {

            if (!file.endsWith(".js"))
                continue;

            const audit = require(path.join(dir, file));

            audits.push({

                name: file.replace(".js", ""),

                fn: audit.run

            });

        }

        audits.push({

            name: "PrivacyAudit",

            fn: require("./PrivacyAudit").run

        });

        return audits;

    }

};
