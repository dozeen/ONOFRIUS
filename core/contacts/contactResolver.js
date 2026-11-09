const ConfigManager = require("../config/ConfigManager");

function normalize(id) {
    return String(id || "")
        .replace(/@.*/, "")
        .trim();
}

function resolve(id) {
    id = normalize(id);
    const contacts = ConfigManager.contacts();
    const identities = ConfigManager.identities();

    const personId = identities[id];

    if (!personId || !contacts[personId]) {
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
