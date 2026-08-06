const ConfigManager = require("../config/ConfigManager");
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
        const contacts = ConfigManager.contacts();
        const chatId = context.chatId || context.sender || "";
        const id = this.identifier.normalize(chatId);
        const displayName = context.contactName || context.chat?.name || "";

        let contact = null;

        if (contacts[id]) {
            contact = contacts[id];
        }

        if (!contact) {
            const name = this.normalizeName(displayName);

            for (const [key, value] of Object.entries(contacts)) {
                if (key === "default") continue;

                if (this.normalizeName(key) === name) {
                    contact = value;
                    break;
                }

                if (value && this.normalizeName(value.name) === name) {
                    contact = value;
                    break;
                }
            }
        }

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
