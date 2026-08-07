let contacts = [];
try {
    contacts = require("../config/contacts.json");
} catch (e1) {
    try {
        contacts = require("../config/contacts.json");
    } catch (e2) {
        contacts = [];
    }
}
const IdentifierResolver = require("./IdentifierResolver");

class IdentityResolver {
    constructor() {
        this.identifier = new IdentifierResolver();
    }

    normalizeName(name) {
        if (!name) return "";
        return name.toLowerCase().trim();
    }

    resolve(context) {
        const chatId = context.chatId || context.sender || "";
        const id = this.identifier.normalize(chatId);
        const displayName = context.contactName || context.senderName || context.chat?.name || "";

        let contact = null;

        // 1) Ricerca per numero o ID esatto
        if (contacts[id]) {
            contact = contacts[id];
        }

        // 2) Ricerca per nome/chiave
        if (!contact && displayName) {
            const name = this.normalizeName(displayName);
            for (const [key, value] of Object.entries(contacts)) {
                if (key === "default") continue;
                if (this.normalizeName(key) === name || this.normalizeName(value.name) === name) {
                    contact = value;
                    break;
                }
            }
        }

        // 3) Se il contatto ha un pushname/displayName valido (es. Lucia, Marco)
        if (!contact && displayName && displayName !== "Sconosciuto" && displayName.length > 1) {
            contact = {
                name: displayName,
                relationship: "known",
                type: "contact",
                source: "pushname"
            };
        }

        // 4) Fallback
        if (!contact) {
            contact = contacts.default;
        }

        return {
            id,
            displayName: displayName || contact.name,
            contact,
            groups: []
        };
    }
}

module.exports = new IdentityResolver();
