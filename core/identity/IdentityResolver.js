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
            contact = contacts.default || {};
        }

        const enrichedContact = {
            name: displayName || contact.name || "Unknown",
            type: contact.type || (context.isOwner ? "Owner" : "Contact"),
            relationship: contact.relationship || contact.relation || (context.isOwner ? "Owner" : "Standard Contact"),
            role: contact.role || (context.isOwner ? "owner" : "user"),
            model: contact.model || "qwen2.5:latest",
            personality: contact.personality || "standard",
            style: {
                verbosity: contact.style?.verbosity || "Medium",
                emoji: contact.style?.emoji || "Moderate",
                smallTalk: contact.style?.smallTalk || "Low",
                humor: contact.style?.humor || "Light",
                romantic: contact.style?.romantic || "None",
                explanations: contact.style?.explanations || "Concise"
            },
            ...contact
        };

        enrichedContact.name = enrichedContact.name || displayName || "Unknown";
        enrichedContact.type = enrichedContact.type || "Contact";
        enrichedContact.relationship = enrichedContact.relationship || "Standard Contact";

        return {
            id,
            displayName: enrichedContact.name,
            contact: enrichedContact,
            groups: []
        };
    }
}

module.exports = new IdentityResolver();
