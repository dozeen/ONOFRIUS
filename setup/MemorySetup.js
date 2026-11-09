const fs = require("fs");

const folders = [
    "memory",
    "memory/facts",
    "memory/thoughts",
    "memory/agenda",
    "memory/events",
    "memory/style",
    "memory/knowledge",
    "memory/logs"
];

module.exports = {

    async run() {

        for (const folder of folders) {

            fs.mkdirSync(folder, {
                recursive: true
            });

        }

        console.log("✓ Memory");

    }

};
