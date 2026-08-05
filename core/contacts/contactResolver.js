const fs = require("fs");
const path = require("path");

const contacts = require("../../config/contacts.json");

const identitiesFile = path.join(
    __dirname,
    "../../config/identities.json"
);

let identities = {};

if (fs.existsSync(identitiesFile)) {

    try {

        identities = JSON.parse(
            fs.readFileSync(identitiesFile, "utf8")
        );

    } catch {

        identities = {};

    }

}

function normalize(id) {

    return String(id || "")
        .replace(/@.*/, "")
        .trim();

}

function resolve(id) {

    id = normalize(id);

    const personId = identities[id];

    if (!personId) {

        return {

            ...contacts.default,

            source: "unknown"

        };

    }

    return {

        ...contacts[personId],

        source: "contacts"

    };

}

module.exports = {

    resolve

};
