const fs = require("fs");
const path = require("path");

class EventReader {

    constructor(options = {}) {

        this.historyPath =
            options.historyPath ||
            path.join(process.cwd(), "memory", "history");

    }

    async read(options = {}) {

        const events = [];

        await this.walk(
            this.historyPath,
            events,
            options
        );

        events.sort((a, b) => {

            const ta = Number(a.timestamp || 0);
            const tb = Number(b.timestamp || 0);

            return ta - tb;

        });

        return events;

    }

    async walk(dir, events, options) {

        if (!fs.existsSync(dir))
            return;

        const files = fs.readdirSync(dir, {
            withFileTypes: true
        });

        for (const file of files) {

            const full =
                path.join(dir, file.name);

            if (file.isDirectory()) {

                await this.walk(
                    full,
                    events,
                    options
                );

                continue;

            }

            if (!file.name.endsWith(".jsonl"))
                continue;

            this.readJsonl(
                full,
                events,
                options
            );

        }

    }

    readJsonl(file, events, options) {

        const rows =
            fs.readFileSync(file, "utf8")
                .split("\n")
                .filter(Boolean);

        for (const row of rows) {

            try {

                const event =
                    JSON.parse(row);

                if (
                    options.since &&
                    Number(event.timestamp || 0) <= Number(options.since)
                ) {
                    continue;
                }

                events.push(event);

            }
            catch {

                console.warn("JSONL non valido:", file);

            }

        }

    }

}

module.exports = EventReader;
