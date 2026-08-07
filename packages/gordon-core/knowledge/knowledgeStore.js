const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(process.cwd(), "knowledge", "contacts");

class KnowledgeStore {

    file(name) {
        return path.join(ROOT, `${name}.json`);
    }

    async load(name) {

        try {

            const text = await fs.readFile(
                this.file(name),
                "utf8"
            );

            return JSON.parse(text);

        } catch {

            return null;

        }

    }

    async save(profile) {

        await fs.mkdir(ROOT, { recursive: true });

        await fs.writeFile(
            this.file(profile.name),
            JSON.stringify(profile, null, 4)
        );

    }

}

module.exports = KnowledgeStore;
