/**
 * LinguisticConscience.js - Coscienza Linguistica Intoccabile di Gordon
 * Valuta l'identità: "Onofrio scriverebbe davvero questa frase?"
 */

const style = require("./GordonStyle");

class LinguisticConscience {
    constructor() {
        this.style = style;
    }

    /**
     * Filtro Identitario Intoccabile
     */
    evaluate(response) {
        if (!response || typeof response !== "string") return response;

        let cleaned = response.trim();

        // 1. Rimozione emoji se avoidEmojis è true
        if (this.style.avoidEmojis) {
            cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu, '').trim();
        }

        // 2. Rimozione cliché da assistente commerciale ed espressioni assistenziali
        const sortedCliches = [...this.style.forbiddenCliches].sort((a, b) => b.length - a.length);
        for (const cliche of sortedCliches) {
            const escaped = cliche.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\s*\\b${escaped}\\b[.,!?]?`, "gi");
            cleaned = cleaned.replace(regex, "").trim();
        }

        // 3. Pulizia di spazi e punteggiatura residui
        cleaned = cleaned.replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").replace(/\.+/g, ".").trim();

        return cleaned;
    }
}

module.exports = new LinguisticConscience();
