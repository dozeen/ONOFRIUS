const contacts = require("../../config/contacts.json");
const identities = require("../../config/identities.json");

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
