const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "policies.json");

class PolicyStore {

    load() {

        if (!fs.existsSync(FILE)) {

            return {

                global: {
                    mode: "on"
                },

                contacts: {},

                groups: {}

            };

        }

        return JSON.parse(fs.readFileSync(FILE, "utf8"));

    }

    save(data) {

        fs.writeFileSync(
            FILE,
            JSON.stringify(data, null, 4)
        );

    }

}

module.exports = new PolicyStore();
