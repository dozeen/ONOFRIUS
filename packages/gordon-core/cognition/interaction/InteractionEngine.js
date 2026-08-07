/**
 * InteractionEngine.js - Motore per l'adattamento sociale e dello stile di risposta
 */

const InteractionProfile = require("./InteractionProfile");

class InteractionEngine {
    static INPUT = ["context", "senderName", "contactName"];
    static OUTPUT = ["interactionStyle"];

    constructor(profileStore) {
        this.profileStore = profileStore || new InteractionProfile();
    }

    /**
     * Determina lo stile di interazione ottimale per il contesto corrente
     * @param {Object} context
     * @returns {Object} InteractionStyle { profile, directives }
     */
    evaluateStyle(context) {
        const sender = context.sender || context.senderName || "unknown";
        const senderName = (context.senderName || context.contactName || "").toLowerCase();

        // 1. Inserimento o recupero del profilo di base
        let defaults = { role: "unknown", formality: 0.5, emojiUsage: 0.3, affection: 0.3 };

        if (context.isOwner) {
            defaults = { role: "owner", formality: 0.2, irony: 0.4, affection: 0.5 };
        } else if (senderName.includes("vip")) {
            defaults = { role: "family", formality: 0.1, emojiUsage: 0.6, affection: 0.9, irony: 0.3 };
        } else if (senderName.includes("gerardo") || sender.includes("3500903187")) {
            defaults = { role: "client_reference", formality: 0.8, emojiUsage: 0.1, affection: 0.1, messageLength: "medium" };
        } else if (context.isGroup) {
            defaults = { role: "group", formality: 0.5, emojiUsage: 0.2, affection: 0.1, messageLength: "concise" };
        } else if (senderName.includes("cliente") || context.isClient) {
            defaults = { role: "client", formality: 0.85, emojiUsage: 0.0, affection: 0.0, messageLength: "medium" };
        }

        const profile = this.profileStore.getProfile(sender, defaults);

        // 2. Costruzione direttive di stile
        const directives = [];

        if (profile.role === "client" || profile.role === "client_reference") {
            directives.push("Usa un tono professionale, rispettoso ed essenziale.");
            directives.push("FORMATO RISPOSTA PREVENTIVI/PRESTAZIONI (Modello Gerardo Pizzaiolo +39 350 090 3187): Rispondi nello stile esatto: 'Perfetto [Nome], il costo della serenata / evento tutto compreso luci, impianto audio e tutto il necessario è di €[Prezzo]'. Sii trasparente ed essenziale.");
            directives.push("Non utilizzare emoji eccessive né confidenza inappropriata.");
        } else if (profile.role === "family" || profile.affection > 0.7) {
            directives.push("Usa un tono affettuoso, caldo e vicino.");
            directives.push("Puoi usare emoji espressive.");
        } else if (profile.role === "group") {
            directives.push("Stai nel gruppo: sii conciso, rispondi solo se direttamente chiamato in causa o rilevante.");
        } else if (profile.role === "owner") {
            directives.push("Tratta Onofrio con naturalezza, brevità e ironia leggera.");
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
