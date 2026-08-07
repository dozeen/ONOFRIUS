const fs = require("fs");
const path = require("path");

const FILE =
    path.join(
        process.cwd(),
        "memory",
        "knowledge",
        "knowledge.json"
    );

class MemoryStore {

    load() {

        if (!fs.existsSync(FILE))
            return [];

        return JSON.parse(
            fs.readFileSync(FILE)
        );

    }

    save(data) {

        fs.writeFileSync(
            FILE,
            JSON.stringify(data, null, 4)
        );

    }

}

module.exports = new MemoryStore();
