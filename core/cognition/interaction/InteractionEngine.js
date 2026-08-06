/**
 * InteractionEngine.js - Motore per l'adattamento sociale e dello stile di risposta
 */

const fs = require("fs");
const path = require("path");
const InteractionProfile = require("./InteractionProfile");

function getOwnerConfig() {
    const ownerPath = path.resolve(__dirname, "../../../config/owner.json");
    if (fs.existsSync(ownerPath)) {
        try {
            return JSON.parse(fs.readFileSync(ownerPath, "utf8"));
        } catch (e) {}
    }
    return { name: "Owner", aliases: ["owner", "me"] };
}

class InteractionEngine {
    static INPUT = ["context", "senderName", "contactName"];
    static OUTPUT = ["interactionStyle"];

    constructor(profileStore) {
        this.profileStore = profileStore || new InteractionProfile();
    }

    evaluateStyle(context) {
        const owner = getOwnerConfig();
        const sender = context.sender || context.senderName || "unknown";
        const senderName = (context.senderName || context.contactName || "").toLowerCase();

        let defaults = { role: "unknown", formality: 0.5, emojiUsage: 0.3, affection: 0.3 };

        if (context.isOwner) {
            defaults = { role: "owner", formality: 0.2, irony: 0.4, affection: 0.5 };
        } else if (context.isFamily) {
            defaults = { role: "family", formality: 0.1, emojiUsage: 0.6, affection: 0.9, irony: 0.3 };
        } else if (context.isGroup) {
            defaults = { role: "group", formality: 0.5, emojiUsage: 0.2, affection: 0.1, messageLength: "concise" };
        } else if (context.isClient) {
            defaults = { role: "client", formality: 0.85, emojiUsage: 0.0, affection: 0.0, messageLength: "medium" };
        }

        const profile = this.profileStore.getProfile(sender, defaults);
        const directives = [];

        if (profile.role === "client" || profile.role === "client_reference") {
            directives.push("Usa un tono professionale, rispettoso ed essenziale.");
            directives.push("FORMATO RISPOSTA PREVENTIVI/PRESTAZIONI: Rispondi in modo trasparente ed essenziale specificando i dettagli ed i costi.");
            directives.push("Non utilizzare emoji eccessive né confidenza inappropriata.");
        } else if (profile.role === "family" || profile.affection > 0.7) {
            directives.push("Usa un tono affettuoso, caldo e vicino.");
            directives.push("Puoi usare emoji espressive.");
        } else if (profile.role === "group") {
            directives.push("Stai nel gruppo: sii conciso, rispondi solo se direttamente chiamato in causa o rilevante.");
        } else if (profile.role === "owner") {
            directives.push(`Tratta ${owner.name || "l'owner"} con naturalezza, brevità e ironia leggera.`);
        } else {
            directives.push("Mantieni un tono naturale, neutro ed equilibrato.");
        }

        if (profile.formality >= 0.8) {
            directives.push("Mantieni un'elevata formalità ed evita abbreviazioni.");
        } else if (profile.formality <= 0.2) {
            directives.push("Sii del tutto informale e diretto.");
        }

        return {
            profile: profile,
            directives: directives
        };
    }
}

module.exports = InteractionEngine;
