/**
 * StyleLearningEngine.js - Apprendimento dai Messaggi Reali di Onofrio (Few-Shot Canonical Patterns)
 */

const fs = require("fs");
const path = require("path");

class StyleLearningEngine {
    constructor() {
        this.filePath = path.resolve(__dirname, "../memory/style/canonicalPatterns.json");
        this.patterns = {};
        this.loadMemory();
        this.seedInitialPatterns();
    }

    loadMemory() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
                this.patterns = data;
            }
        } catch (e) {
            console.error("⚠️ Errore caricamento canonicalPatterns.json:", e.message);
        }
    }

    saveMemory() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this.filePath, JSON.stringify(this.patterns, null, 2), "utf8");
        } catch (e) {
            console.error("⚠️ Errore salvataggio canonicalPatterns.json:", e.message);
        }
    }

    /**
     * Pattern Canonici Iniziali tratti dalle risposte reali di Onofrio
     */
    seedInitialPatterns() {
        if (Object.keys(this.patterns).length === 0) {
            this.patterns = {
                "phone_request": {
                    "examples": ["Ti chiamo.", "Arrivo.", "Ok.", "Ti faccio uno squillo dopo."],
                    "preferredStyle": { "length": "minimal", "initiative": "low", "questions": false, "emoji": false }
                },
                "thanks": {
                    "examples": ["Prego.", "Figurati.", "Ok."],
                    "preferredStyle": { "length": "minimal", "initiative": "low", "questions": false, "emoji": false }
                },
                "photo_request": {
                    "examples": ["Te la mando.", "Dopo te la giro.", "Ok."],
                    "preferredStyle": { "length": "minimal", "initiative": "low", "questions": false, "emoji": false }
                },
                "joke": {
                    "examples": ["Ahah vero.", "Ci mancherebbe.", "Infatti."],
                    "preferredStyle": { "length": "short", "initiative": "low", "questions": false, "emoji": false }
                },
                "confirmation": {
                    "examples": ["Ok.", "Va bene.", "Perfetto.", "Ci sono."],
                    "preferredStyle": { "length": "minimal", "initiative": "low", "questions": false, "emoji": false }
                },
                "availability": {
                    "examples": ["Sì dimmi.", "Eccomi.", "Dimmi pure."],
                    "preferredStyle": { "length": "minimal", "initiative": "low", "questions": false, "emoji": false }
                }
            };
            this.saveMemory();
        }
    }

    /**
     * Identifica l'atto linguistico (speechAct) del messaggio in ingresso
     */
    classifySpeechAct(text) {
        if (!text || typeof text !== "string") return "general";
        const lower = text.toLowerCase().trim();

        if (lower.includes("chiam") || lower.includes("squillo") || lower.includes("telefon")) {
            return "phone_request";
        }
        if (lower.includes("grazie") || lower.includes("thanks")) {
            return "thanks";
        }
        if (lower.includes("foto") || lower.includes("immagine") || lower.includes("screen") || lower.includes("manda")) {
            return "photo_request";
        }
        if (lower.includes("ahah") || lower.includes("huhu") || lower.includes("scherz")) {
            return "joke";
        }
        if (lower.includes("posso") || lower.includes("ci sei") || lower.includes("disponibile")) {
            return "availability";
        }
        if (lower === "ok" || lower === "va bene" || lower === "perfetto" || lower === "confermato") {
            return "confirmation";
        }

        return "general";
    }

    /**
     * Apprende una nuova risposta reale inviata da Onofrio (fromMe: true dell'Owner)
     */
    learnRealOwnerReply(inputText, ownerReplyText) {
        if (!inputText || !ownerReplyText) return;

        const speechAct = this.classifySpeechAct(inputText);
        const reply = ownerReplyText.trim();

        if (!this.patterns[speechAct]) {
            this.patterns[speechAct] = {
                examples: [],
                preferredStyle: { length: "minimal", initiative: "low", questions: false, emoji: false }
            };
        }

        // Aggiunge l'esempio se non è già presente
        if (!this.patterns[speechAct].examples.includes(reply)) {
            this.patterns[speechAct].examples.unshift(reply);
            if (this.patterns[speechAct].examples.length > 8) {
                this.patterns[speechAct].examples.pop();
            }
            this.saveMemory();
            console.log(`🧠 [StyleLearningEngine] Appreso nuovo esempio canonico per '${speechAct}': "${reply}"`);
        }
    }

    /**
     * Recupera gli esempi canonici di Onofrio per il messaggio corrente
     */
    getCanonicalExemplars(text) {
        const speechAct = this.classifySpeechAct(text);
        const patternData = this.patterns[speechAct] || this.patterns["general"];

        if (patternData && patternData.examples && patternData.examples.length > 0) {
            return {
                speechAct,
                examples: patternData.examples.slice(0, 4)
            };
        }

        return null;
    }
}

module.exports = new StyleLearningEngine();
