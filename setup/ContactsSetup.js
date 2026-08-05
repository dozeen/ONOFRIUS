const fs = require("fs");
const path = require("path");

module.exports = {

    async run() {

        const file = path.join("config", "contacts.json");

        if (!fs.existsSync(file)) {

            fs.copyFileSync(
                "templates/contacts.example.json",
                file
            );

            console.log("✓ contacts.json created");

        } else {

            console.log("✓ contacts.json already exists");

        }

    }

};
