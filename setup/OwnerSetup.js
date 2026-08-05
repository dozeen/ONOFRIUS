const fs = require("fs");
const path = require("path");

module.exports = {

    async run() {

        const configDir = "config";

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        const ownerFile = path.join(configDir, "owner.json");

        if (!fs.existsSync(ownerFile)) {

            fs.copyFileSync(
                "templates/owner.example.json",
                ownerFile
            );

            console.log("✓ owner.json created");

        } else {

            console.log("✓ owner.json already exists");

        }

    }

};
