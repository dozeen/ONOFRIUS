/**
 * PersonalityEngine.js - Coscienza Linguistica di Gordon & Formattatore di Naturalezza
 */

const style = require("./GordonStyle");

class PersonalityEngine {
    constructor() {
        this.style = style;
    }

    sanitize(response) {
        return this.evalLinguisticConscience(response);
    }

    /**
     * Coscienza Linguistica di Gordon:
     * Valuta se la risposta sarebbe stata realmente scritta da Onofrio.
     * Se un dettaglio suona artificiale o assistenziale, lo elimina.
     */
    evalLinguisticConscience(response) {
        if (!response || typeof response !== "string") return response;

        let cleaned = response.trim();

        // 1. Rimozione emoji se avoidEmojis è true
        if (this.style.avoidEmojis) {
            cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu, '').trim();
        }

        // 2. Rimozione cliché commerciali ed espressioni assistenziali
        const sortedCliches = [...this.style.forbiddenCliches].sort((a, b) => b.length - a.length);
        for (const cliche of sortedCliches) {
            const escaped = cliche.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\s*\\b${escaped}\\b[.,!?]?`, "gi");
            cleaned = cleaned.replace(regex, "").trim();
        }

        // 3. Pulizia di spazi e punteggiatura duplicata residui
        cleaned = cleaned.replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").replace(/\.+/g, ".").trim();

        return cleaned;
    }

    generateGreeting(moodContext) {
        const mood = moodContext.mood || "casual";
        const isOwner = moodContext.isOwner;
        const isLongText = moodContext.isLongText;

        if (isLongText) {
            return "Ho letto tutto. Dimmi pure.";
        }

        switch (mood) {
            case "return_after_hours":
                return isOwner ? "Bentornato. Dimmi." : "Bentornato.";

            case "owner_message":
                return "Dimmi.";

            case "first_contact":
                return "Buongiorno. C'è qualcosa di nuovo?";

            case "technical_discussion":
                return "Ti ascolto. Raccontami.";

            case "ritual":
            default:
                const options = [
                    "Buongiorno.",
                    "Buongiorno. Come va?",
                    "Dimmi.",
                    "Eccomi."
                ];
                const choiceIndex = Math.floor(Math.random() * options.length);
                return options[choiceIndex];
        }
    }

    format(response, context = {}) {
        if (!response) return response;

        let formatted = this.evalLinguisticConscience(response);

        if (!formatted || formatted.length === 0) {
            return "Va bene.";
        }

        return formatted;
    }
}

module.exports = new PersonalityEngine();
