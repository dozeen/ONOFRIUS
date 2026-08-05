const fs = require("fs");
const path = require("path");

module.exports = {

    async run() {

        const file = path.join("config", "settings.json");

        if (!fs.existsSync(file)) {

            fs.copyFileSync(
                "templates/settings.example.json",
                file
            );

            console.log("✓ settings.json created");

        } else {

            console.log("✓ settings.json already exists");

        }

    }

};
