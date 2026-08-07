const fs = require("fs");
const path = require("path");

class StateManager {

    constructor(options = {}) {

        this.directory =
            options.directory ||
            path.join(process.cwd(), "memory", "consolidation");

        this.file =
            path.join(this.directory, "state.json");

    }

    load() {

        if (!fs.existsSync(this.directory)) {

            fs.mkdirSync(this.directory, {
                recursive: true
            });

        }

        if (!fs.existsSync(this.file)) {

            return {
                version: 1,
                lastRun: null,
                lastProcessedTimestamp: null,
                processedEvents: 0
            };

        }

        return JSON.parse(
            fs.readFileSync(this.file, "utf8")
        );

    }

    save(state) {

        fs.writeFileSync(

            this.file,

            JSON.stringify(
                state,
                null,
                4
            )

        );

    }

}

module.exports = StateManager;
