/**
 * LinguisticConscience.js - Coscienza Linguistica Intoccabile di Gordon
 * Valuta l'identità: "L'Owner scriverebbe davvero questa frase?"
 */

const style = require("./GordonStyle");

class LinguisticConscience {
    constructor() {
        this.style = style;
    }

    /**
     * Filtro Identitario Intoccabile
     */
    evaluate(response, context = {}) {
        if (!response || typeof response !== "string") return response;

        let cleaned = response.trim();

        // 1. Conserviamo le emoji per comunicazioni naturali ed amichevoli
        if (this.style.avoidEmojis === true) {
            cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu, '').trim();
        }

        // 2. Correzione scivoloni del formale "Lei" verso persone care
        cleaned = cleaned.replace(/\b(averla\s+lasciata)\b/gi, "averti lasciata");
        cleaned = cleaned.replace(/\b(stia\s+tranquilla)\b/gi, "stai tranquilla");
        cleaned = cleaned.replace(/\b(stia\s+tranquillo)\b/gi, "stai tranquillo");
        cleaned = cleaned.replace(/\b(sono\s+tutto\s+orecchi?o?)\b[.,!?]?/gi, "");

        // 3. Rimozione intercalare "Amen" immotivato
        cleaned = cleaned.replace(/^\s*Amen\s*[,.]?\s*/gi, "");

        // 4. Correzione genere se l'interlocutrice è donna
        const contactName = String(context.contactName || context.contact?.name || "").toLowerCase();
        const isFemale = String(context.relationship || "").includes("amica") || String(context.relationship || "").includes("moglie") || String(context.relationship || "").includes("figlia");
        
        if (isFemale) {
            cleaned = cleaned.replace(/\b(mio\s+caro)\b/gi, "mia cara");
            cleaned = cleaned.replace(/\b(ragazzone)\b/gi, "cara");
            cleaned = cleaned.replace(/\b(amico\s+mio)\b/gi, "amica mia");
            cleaned = cleaned.replace(/\b(bello)\b/gi, "bella");
        }

        // 5. Rimozione cliché da assistente commerciale ed espressioni assistenziali
        const sortedCliches = [...this.style.forbiddenCliches].sort((a, b) => b.length - a.length);
        for (const cliche of sortedCliches) {
            const escaped = cliche.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\s*\\b${escaped}\\b[.,!?]?`, "gi");
            cleaned = cleaned.replace(regex, "").trim();
        }

        // 6. Pulizia di spazi e punteggiatura residui
        cleaned = cleaned.replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").replace(/\.+/g, ".").trim();

        return cleaned;
    }
}

module.exports = new LinguisticConscience();
