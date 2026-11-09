const fs = require("fs");
const path = require("path");

const config = {};

const dir = path.resolve("./config");

for (const file of fs.readdirSync(dir)) {

    if (!file.endsWith(".js"))
        continue;

    config[path.basename(file, ".js")] =
        require(path.join(dir, file));

}

module.exports = config;
