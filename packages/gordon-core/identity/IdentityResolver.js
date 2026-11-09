let contacts = {};
try { contacts = require("../../config/contacts.json"); } catch (e) {
    try { contacts = require("../config/contacts.json"); } catch (e2) { contacts = {}; }
}
let identities = {};
try { identities = require("../../config/identities.json"); } catch (e) {
    try { identities = require("../config/identities.json"); } catch (e2) { identities = {}; }
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

        // 1) Ricerca per ID o mapping in identities.json
        const personKey = identities[id];
        if (personKey && contacts[personKey]) {
            contact = contacts[personKey];
        } else if (contacts[id]) {
            contact = contacts[id];
        }

        // 2) Ricerca per nome/chiave
        if (!contact && displayName) {
            const name = this.normalizeName(displayName);
            for (const [key, value] of Object.entries(contacts)) {
                if (key === "default") continue;
                const normKey = this.normalizeName(key);
                const normVal = this.normalizeName(value.name);
                if (normKey === name || normVal === name || (normVal && normVal.length > 2 && name.startsWith(normVal))) {
                    contact = value;
                    break;
                }
            }
        }

        // 3) Se il contatto ha un pushname/displayName valido (es. ContattoF, Marco)
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

        const rawName = displayName || context.contactName || context.senderName || contact?.name || "";
        const isLocales = /locale(s)?/i.test(rawName) || /locale(s)?/i.test(id) || /locale(s)?/i.test(contact?.name || "") || /locale(s)?/i.test(contact?.relationship || "") || contact?.isLocales === true;

        if (isLocales) {
            contact = {
                ...contact,
                isLocales: true,
                relationship: "locales",
                role: "locales"
            };
            context.isLocales = true;
        }

        return {
            id,
            displayName: displayName || contact?.name || 'Utente',
            contact,
            groups: []
        };
    }
}

module.exports = new IdentityResolver();
