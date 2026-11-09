const fs = require("fs");
const path = require("path");

module.exports = {

    async run() {

        const file = path.join(
            process.cwd(),
            "config",
            "identities.json"
        );

        if (!fs.existsSync(file)) {

            fs.writeFileSync(file, "{}\n");

            console.log("✓ identities.json created");

        } else {

            console.log("✓ identities.json already exists");

        }

    }

};
