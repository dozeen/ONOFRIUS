let contacts = []; try { contacts = require("../config/contacts.json"); } catch (e) { try { contacts = require("../config/contacts.json"); } catch (e2) { contacts = []; } }
let identities = {}; try { identities = require("../config/identities.json"); } catch (e) { try { identities = require("../config/identities.json"); } catch (e2) { identities = {}; } }

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
